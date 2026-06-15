/*
 * Foster Rx certificate verify page — client-side verification module.
 * Phase 2.8 Workstream 2 — Step 4b. Path Z: signature verification only.
 *
 * Verifies the Ed25519 signature on a Foster Rx certificate envelope against
 * the trust anchor published at fosterrx.com/.well-known/. The verification
 * runs entirely in the browser using the self-hosted, SRI-pinned
 * @noble/ed25519 module (./noble-ed25519.js).
 *
 * Contract (from reconnaissance OQ-1..OQ-5):
 *   - Envelope endpoint returns server-computed `canonical_form_b64` (the exact
 *     signed bytes) so the client does NOT re-canonicalize. We verify the
 *     signature over those bytes verbatim.
 *   - Signature is `signature_hex` (hex, 64 bytes). Trust anchor is an Ed25519
 *     SPKI PEM; the raw 32-byte key is the PEM minus the 12-byte SPKI prefix.
 *   - Before verifying, the envelope's `signing_key_fingerprint` is compared
 *     (case-insensitive) to the published fingerprint; a mismatch stops the flow.
 *
 * SECURITY: the production page calls orchestrate() with the hardcoded real
 * trust-anchor URLs below. There is intentionally NO switch, URL param, or
 * build flag that can redirect the trust anchor. The dev-only test harness
 * (/verify/_test.html) does NOT call orchestrate(); it imports the building-
 * block functions and drives them with local fixtures + a test key.
 *
 * All customer-visible strings are the approved prose
 * (.claude/workstream2/verify_page_prose_draft.md). Do not edit copy here
 * without a corresponding prose-doc change.
 */

import * as ed25519 from "./noble-ed25519.js";

// ─── Constants (production, hardcoded — not overridable from the page) ───────
const API_BASE = "https://foster-rx-synth-api-oheqxmpdqa-uk.a.run.app";
const TRUST_ANCHOR_PEM_URL = "/.well-known/angis-signing-key-v1.pub";
// NOTE: real published file is `…-v1.fingerprint` (NOT `…-v1.pub.fingerprint`,
// which 404s). Confirmed against the deployed apex. See Phase A report.
const TRUST_ANCHOR_FINGERPRINT_URL = "/.well-known/angis-signing-key-v1.fingerprint";

// Ed25519 SubjectPublicKeyInfo DER prefix (12 bytes, RFC 8410).
const ED25519_SPKI_PREFIX = Uint8Array.from([
  0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
]);

// Lenient on the UUID version/variant nibbles (internal detail); strict on the
// FRXS- prefix and the 8-4-4-4-12 hex shape. Case-insensitive (recon OQ-2).
const CERT_ID_RE =
  /^FRXS-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

// ─── Approved copy (single source of truth for JS-rendered strings) ──────────
// Each entry: { label, body }. IDs reference the prose document.
const COPY = {
  // Badge states
  pending: {
    label: "Verifying signature…", // B1
    body: "Checking this certificate's signature against Foster Rx's published signing key.",
  },
  valid: {
    label: "Signature valid", // B2
    body: "This certificate was signed by Foster Rx's published ANGIS signing key.",
  },
  invalid: {
    label: "Signature not valid", // B3 / E6
    body: "This certificate's signature does not verify against Foster Rx's published key. If you obtained this certificate through official channels, contact Foster Rx — there may be an issue with the certificate or the verification process.",
  },
  key_mismatch: {
    label: "Unable to verify", // B4 / E5
    body: "This certificate names a signing key that does not match Foster Rx's currently published key. We did not attempt signature verification.",
  },
  signature_missing: {
    label: "Unable to verify", // B5 / E9
    body: "This certificate does not carry a signature, so there is nothing to verify.",
  },
  fetch_error: {
    label: "Unable to verify", // B6 (generic non-404 retrieval failure)
    body: "We couldn't retrieve this certificate to verify it. Please check the certificate ID and try again.",
  },
  malformed_cert_id: {
    label: "Unable to verify", // E2
    body: "That doesn't look like a Foster Rx certificate ID. A valid ID begins with \"FRXS-\". Please check the ID and try again.",
  },
  cert_not_found: {
    label: "Unable to verify", // E3
    body: "No certificate was found for this ID. Please check that you entered it correctly.",
  },
  network_error: {
    label: "Unable to verify", // E4
    body: "We couldn't reach the Foster Rx certificate service. Please check your connection and try again.",
  },
  envelope_parse_error: {
    label: "Unable to verify", // E10
    body: "We received an unexpected response while retrieving this certificate. Please try again shortly.",
  },
  // Trust-anchor errors share a state but pick body by `detail` (E7 / E8).
  trust_anchor_error: {
    label: "Unable to verify",
    body: "We couldn't load Foster Rx's published signing key, so we can't verify this certificate right now. Please try again shortly.", // E7 (PEM), default
    bodyFingerprint:
      "We couldn't load Foster Rx's published signing-key fingerprint, so we can't verify this certificate right now. Please try again shortly.", // E8
  },
};

// ─── Tagged errors so orchestrate() can map failures to badge states ─────────
class NotFoundError extends Error {}
class FetchError extends Error {} // non-404 HTTP failure
class NetworkError extends Error {} // fetch rejected (offline/CORS/DNS)
class ParseError extends Error {}
class TrustAnchorError extends Error {
  constructor(message, which) {
    super(message);
    this.which = which; // 'pem' | 'fingerprint'
  }
}

// ─── Encoding helpers ────────────────────────────────────────────────────────
function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex) {
  const clean = hex.trim();
  if (clean.length === 0 || clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) {
    throw new Error("invalid hex");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// ─── Core functions (exported; reused by the dev-only test harness) ──────────

export function parseCertIdFromPath(pathname = window.location.pathname) {
  // /verify  or /verify/  -> bare (null). /verify/<id> -> <id>.
  const segments = pathname.split("/").filter((s) => s.length > 0);
  const i = segments.indexOf("verify");
  if (i === -1) return null;
  const rest = segments.slice(i + 1);
  if (rest.length === 0) return null;
  try {
    return decodeURIComponent(rest[rest.length - 1]);
  } catch {
    return rest[rest.length - 1];
  }
}

export function validateCertIdFormat(certId) {
  return typeof certId === "string" && CERT_ID_RE.test(certId);
}

export async function fetchEnvelope(certId) {
  const url = `${API_BASE}/v1/certificates/${encodeURIComponent(certId)}/envelope`;
  let res;
  try {
    res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  } catch (e) {
    throw new NetworkError(String(e));
  }
  if (res.status === 404) throw new NotFoundError("certificate not found");
  if (!res.ok) throw new FetchError(`HTTP ${res.status}`);
  try {
    return await res.json();
  } catch (e) {
    throw new ParseError(String(e));
  }
}

export async function fetchTrustAnchorPem(url = TRUST_ANCHOR_PEM_URL) {
  let res;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (e) {
    throw new TrustAnchorError(String(e), "pem");
  }
  if (!res.ok) throw new TrustAnchorError(`HTTP ${res.status}`, "pem");
  return await res.text();
}

export async function fetchTrustAnchorFingerprint(url = TRUST_ANCHOR_FINGERPRINT_URL) {
  let res;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (e) {
    throw new TrustAnchorError(String(e), "fingerprint");
  }
  if (!res.ok) throw new TrustAnchorError(`HTTP ${res.status}`, "fingerprint");
  return (await res.text()).trim();
}

export function pemToRawKey(pem) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const der = base64ToBytes(b64);
  // Expect 12-byte SPKI prefix + 32-byte raw key = 44 bytes.
  if (der.length !== ED25519_SPKI_PREFIX.length + 32) {
    throw new Error(`unexpected SPKI length ${der.length}`);
  }
  for (let i = 0; i < ED25519_SPKI_PREFIX.length; i++) {
    if (der[i] !== ED25519_SPKI_PREFIX[i]) throw new Error("not an Ed25519 SPKI key");
  }
  return der.slice(ED25519_SPKI_PREFIX.length);
}

export function compareFingerprintCaseInsensitive(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export async function verifySignature(canonicalFormB64, signatureHex, rawKey) {
  const message = base64ToBytes(canonicalFormB64);
  const signature = hexToBytes(signatureHex); // throws on malformed hex
  return await ed25519.verifyAsync(signature, message, rawKey);
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function $(id) {
  return document.getElementById(id);
}

/**
 * Render one UI state. `state` is one of:
 *   'landing' | 'pending' | 'valid' | 'invalid' | 'key_mismatch' |
 *   'signature_missing' | 'cert_not_found' | 'network_error' |
 *   'trust_anchor_error' | 'malformed_cert_id' | 'envelope_parse_error' |
 *   'fetch_error'
 * `opts.detail` selects the trust-anchor body ('pem' | 'fingerprint').
 */
export function renderBadgeState(state, opts = {}) {
  const landing = $("frx-landing");
  const result = $("frx-result");

  if (state === "landing") {
    if (landing) landing.hidden = false;
    if (result) result.hidden = true;
    return;
  }

  if (landing) landing.hidden = true;
  if (result) result.hidden = false;

  const copy = COPY[state];
  const labelEl = $("frx-badge-label");
  const bodyEl = $("frx-badge-explanation");
  const badgeEl = $("frx-badge");

  if (badgeEl) badgeEl.dataset.state = state;
  if (labelEl) labelEl.textContent = copy ? copy.label : "Unable to verify";
  if (bodyEl) {
    let body = copy ? copy.body : "";
    if (state === "trust_anchor_error" && opts.detail === "fingerprint") {
      body = COPY.trust_anchor_error.bodyFingerprint;
    }
    bodyEl.textContent = body;
  }
}

function renderCertId(certId) {
  const el = $("frx-cert-id");
  if (el) el.textContent = certId;
  const row = $("frx-cert-id-row");
  if (row) row.hidden = false;
}

// ─── Orchestration (production entry point) ──────────────────────────────────
export async function orchestrate() {
  // 1. Parse cert_id from URL.
  const rawCertId = parseCertIdFromPath();

  // 2. Bare /verify -> landing.
  if (rawCertId === null) {
    renderBadgeState("landing");
    return;
  }

  // 3. Validate format.
  if (!validateCertIdFormat(rawCertId)) {
    renderBadgeState("malformed_cert_id");
    return;
  }

  // Display the canonical (uppercase) form; fetch uses the same.
  const certId = rawCertId.toUpperCase();
  renderCertId(certId);

  // 4. Pending.
  renderBadgeState("pending");

  // 5. Fetch envelope.
  let envelope;
  try {
    envelope = await fetchEnvelope(certId);
  } catch (e) {
    if (e instanceof NotFoundError) return renderBadgeState("cert_not_found");
    if (e instanceof NetworkError) return renderBadgeState("network_error");
    if (e instanceof ParseError) return renderBadgeState("envelope_parse_error");
    return renderBadgeState("fetch_error"); // FetchError / unknown
  }

  // 6. Fetch trust anchor PEM + fingerprint.
  let pem, publishedFingerprint;
  try {
    pem = await fetchTrustAnchorPem();
    publishedFingerprint = await fetchTrustAnchorFingerprint();
  } catch (e) {
    const which = e instanceof TrustAnchorError ? e.which : "pem";
    return renderBadgeState("trust_anchor_error", { detail: which });
  }

  // 7. Signature must be present. Checked before the fingerprint
  //    cross-check so an unsigned cert (empty signature_hex, empty
  //    signing_key_fingerprint) renders signature_missing rather than
  //    key_mismatch — each state honest about its actual failure mode.
  if (!envelope.signature_hex || envelope.signature_hex.trim().length === 0) {
    return renderBadgeState("signature_missing");
  }

  // 8. Fingerprint cross-check (before verifying).
  if (
    !compareFingerprintCaseInsensitive(
      envelope.signing_key_fingerprint,
      publishedFingerprint
    )
  ) {
    return renderBadgeState("key_mismatch");
  }

  // 9. Verify.
  let rawKey;
  try {
    rawKey = pemToRawKey(pem);
  } catch {
    return renderBadgeState("trust_anchor_error", { detail: "pem" });
  }

  try {
    const ok = await verifySignature(
      envelope.canonical_form_b64,
      envelope.signature_hex,
      rawKey
    );
    renderBadgeState(ok ? "valid" : "invalid");
  } catch {
    // Malformed signature/canonical bytes => does not verify. Honest negative.
    renderBadgeState("invalid");
  }
}

// Expose COPY for the test harness to assert against (not used by production DOM).
export { COPY };
