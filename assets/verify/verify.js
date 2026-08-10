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
 * (docs/verify_page_prose_draft.md). Do not edit copy here
 * without a corresponding prose-doc change.
 */

import * as ed25519 from "./noble-ed25519.js";

// ─── Constants (production, hardcoded — not overridable from the page) ───────
// The public envelope is read directly from the world-readable Firestore
// collection `public_envelopes`, written by the platform's public-envelope
// publisher. The document carries exactly the 4-key verification projection:
// canonical_form_b64, signature_hex, signing_key_fingerprint,
// signature_algorithm. No API key, no Cloud Run hop, no credentials.
const FIRESTORE_PROJECT = "fosterrx-prod";
const FIRESTORE_DATABASE = "foster-rx-synth";
const FIRESTORE_COLLECTION = "public_envelopes";
const FIRESTORE_ENVELOPE_URL = (certId) =>
  `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}` +
  `/databases/${FIRESTORE_DATABASE}/documents/${FIRESTORE_COLLECTION}` +
  `/${encodeURIComponent(certId)}`;
const TRUST_ANCHOR_PEM_URL = "/.well-known/angis-signing-key-v1.pub";
// NOTE: real published file is `…-v1.fingerprint` (NOT `…-v1.pub.fingerprint`,
// which 404s). Confirmed against the deployed apex. See Phase A report.
const TRUST_ANCHOR_FINGERPRINT_URL = "/.well-known/angis-signing-key-v1.fingerprint";

// Ed25519 SubjectPublicKeyInfo DER prefix (12 bytes, RFC 8410).
const ED25519_SPKI_PREFIX = Uint8Array.from([
  0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
]);

// Two ID shapes are legitimately producible by the platform:
//   FRXS-<16 hex>                      -- what every production call site emits
//                                         (certificate_builder, app, certify_brief,
//                                         full_pipeline); this is the common case.
//   FRXS-<8-4-4-4-12 hex>              -- Certificate.certificate_id's
//                                         default_factory, which fires only when a
//                                         Certificate is built with no explicit id.
// Both are accepted: a certificate carrying either is real, and rejecting one at
// the format gate would tell a genuine holder their ID is malformed. Strict on the
// FRXS- prefix; lenient on UUID version/variant nibbles. Case-insensitive (OQ-2).
const CERT_ID_RE =
  /^FRXS-(?:[0-9A-F]{16}|[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})$/i;

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
  // Manifest sections (M1-M8). Rendered only after a valid signature; these
  // describe the signed contents, never the verification result itself.
  manifests: {
    intro:
      "The sources and methodologies below are part of the signed certificate. They were covered by the signature check above.", // M1
    sourcesHeading: "Sources", // M2
    methodologiesHeading: "Methodologies", // M3
    sourcesEmpty: "This certificate does not itemize its sources.", // M4
    methodologiesEmpty: "This certificate does not itemize its methodologies.", // M5
    notApplicable:
      "This certificate type does not carry source or methodology manifests.", // M6
    unavailable:
      "The certificate's contents could not be displayed. This does not affect the signature result above.", // M7
    accessedLabel: "Accessed", // M8
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

/**
 * Unwrap Firestore REST's typed field encoding into a flat object.
 * Firestore returns { fields: { k: { stringValue: "..." } } }; the rest of this
 * module consumes bare strings. Only stringValue is expected in this
 * collection -- any other type is coerced via String() rather than dropped, so
 * a schema drift surfaces downstream as a verification failure (honest) rather
 * than as a silently-absent field (dishonest).
 */
export function unwrapFirestoreFields(doc) {
  const fields = doc && doc.fields;
  if (!fields || typeof fields !== "object") {
    throw new ParseError("envelope document has no fields");
  }
  const out = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val && typeof val === "object" && "stringValue" in val) {
      out[key] = val.stringValue;
    } else if (val && typeof val === "object") {
      const inner = Object.values(val)[0];
      out[key] = inner === undefined || inner === null ? "" : String(inner);
    } else {
      out[key] = "";
    }
  }
  return out;
}

export async function fetchEnvelope(certId) {
  const url = FIRESTORE_ENVELOPE_URL(certId);
  let res;
  try {
    res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  } catch (e) {
    throw new NetworkError(String(e));
  }
  // Firestore returns 404 NOT_FOUND for a missing document and 403
  // PERMISSION_DENIED if the security rules deny the read. These are different
  // failures and must not collapse: a rules regression is not "no such
  // certificate". 403 falls through to FetchError -> "Unable to verify".
  if (res.status === 404) throw new NotFoundError("certificate not found");
  if (res.status === 403) throw new FetchError("HTTP 403 (public read denied)");
  if (!res.ok) throw new FetchError(`HTTP ${res.status}`);
  let doc;
  try {
    doc = await res.json();
  } catch (e) {
    throw new ParseError(String(e));
  }
  return unwrapFirestoreFields(doc);
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

/**
 * Decode the signed canonical bytes into an object. The canonical form is
 * deterministic UTF-8 JSON (ADR-0015: sorted keys, compact separators). These
 * are the exact bytes the Ed25519 signature covers -- rendering from them, and
 * only from them, is what makes the displayed contents attested rather than
 * merely asserted.
 */
export function decodeCanonical(canonicalFormB64) {
  const bytes = base64ToBytes(canonicalFormB64);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return JSON.parse(text);
}

// Display policy for partnership_classification (signed, world-readable).
// "verbatim" renders the enum exactly as it appears in the signed canonical.
// That value is public regardless -- canonical_form_b64 is world-readable and
// must be, for the browser to verify over it -- so any softening here would be
// presentational only, and discoverable. Display-only; never affects the
// signature. All registered methodologies are INTERNAL as of 2026-08-01.
const PARTNERSHIP_DISPLAY = "verbatim";

function partnershipLabel(raw) {
  if (PARTNERSHIP_DISPLAY === "omit") return null;
  if (typeof raw !== "string" || raw.length === 0) return null;
  if (PARTNERSHIP_DISPLAY === "verbatim") return raw;
  return raw.toUpperCase() === "INTERNAL" ? "Internal" : "Partner";
}

function mkEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  // textContent only -- never innerHTML. This content is world-readable and
  // unauthenticated by construction; it is rendered as text, never as markup.
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function renderSourceEntry(entry) {
  const li = mkEl("li", "frx-manifest-item");
  li.appendChild(mkEl("div", "frx-manifest-name", entry.source_name || entry.source_id || ""));
  const meta = [];
  if (entry.source_category) meta.push(entry.source_category);
  if (entry.source_version) meta.push(entry.source_version);
  if (entry.accessed_at) meta.push(`${COPY.manifests.accessedLabel} ${entry.accessed_at}`);
  if (meta.length) li.appendChild(mkEl("div", "frx-manifest-meta", meta.join(" · ")));
  // source_url is rendered as text, not as an anchor: this is unauthenticated
  // third-party-supplied data and must not become a clickable target.
  if (entry.source_url) li.appendChild(mkEl("div", "frx-manifest-url", entry.source_url));
  return li;
}

function renderMethodologyEntry(entry) {
  const li = mkEl("li", "frx-manifest-item");
  const name = entry.methodology_name || entry.methodology_id || "";
  const version = entry.methodology_version ? ` v${entry.methodology_version}` : "";
  li.appendChild(mkEl("div", "frx-manifest-name", `${name}${version}`));
  const label = partnershipLabel(entry.partnership_classification);
  if (label) li.appendChild(mkEl("div", "frx-manifest-meta", label));
  if (entry.description) li.appendChild(mkEl("div", "frx-manifest-desc", entry.description));
  return li;
}

function renderManifestList(host, heading, entries, emptyCopy, itemRenderer) {
  host.appendChild(mkEl("h3", "frx-manifest-heading", heading));
  if (!Array.isArray(entries) || entries.length === 0) {
    // Absent and empty are the same story to a reader. canonical_form() pops
    // these keys when they equal [] (Phase 2.6 backward-compat), so absence is
    // the common case, not an anomaly -- say so plainly rather than hiding it.
    host.appendChild(mkEl("p", "frx-manifest-empty", emptyCopy));
    return;
  }
  const ul = mkEl("ul", "frx-manifest-list");
  for (const entry of entries) {
    if (entry && typeof entry === "object") ul.appendChild(itemRenderer(entry));
  }
  host.appendChild(ul);
}

/**
 * Render the signed source/methodology manifests beneath a valid badge.
 *
 * MUST NOT THROW and MUST NOT touch the badge. Called only after the badge has
 * been rendered; any failure degrades to an in-section message.
 */
export function renderManifests(canonicalFormB64) {
  const host = $("frx-manifests");
  if (!host) return;
  while (host.firstChild) host.removeChild(host.firstChild);

  let canonical;
  try {
    canonical = decodeCanonical(canonicalFormB64);
  } catch {
    host.appendChild(mkEl("p", "frx-manifest-empty", COPY.manifests.unavailable));
    host.hidden = false;
    return;
  }

  try {
    const od = canonical && canonical.output_description;
    if (!od || typeof od !== "object") {
      host.appendChild(mkEl("p", "frx-manifest-empty", COPY.manifests.unavailable));
      host.hidden = false;
      return;
    }

    // `kind` is inside the signed canonical bytes (it is the attested
    // discriminator), so branching on it is safe. Only intelligence_report and
    // brief_report carry manifests; synthetic_data has no such fields at all,
    // and reporting "no sources itemized" for one would be misleading.
    if (od.kind === "synthetic_data") {
      host.appendChild(mkEl("p", "frx-manifest-empty", COPY.manifests.notApplicable));
      host.hidden = false;
      return;
    }

    host.appendChild(mkEl("p", "frx-manifest-intro", COPY.manifests.intro));
    renderManifestList(
      host,
      COPY.manifests.sourcesHeading,
      od.source_manifest,
      COPY.manifests.sourcesEmpty,
      renderSourceEntry
    );
    renderManifestList(
      host,
      COPY.manifests.methodologiesHeading,
      od.methodology_manifest,
      COPY.manifests.methodologiesEmpty,
      renderMethodologyEntry
    );
    host.hidden = false;
  } catch {
    while (host.firstChild) host.removeChild(host.firstChild);
    host.appendChild(mkEl("p", "frx-manifest-empty", COPY.manifests.unavailable));
    host.hidden = false;
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

  let ok = false;
  try {
    ok = await verifySignature(
      envelope.canonical_form_b64,
      envelope.signature_hex,
      rawKey
    );
    renderBadgeState(ok ? "valid" : "invalid");
  } catch {
    // Malformed signature/canonical bytes => does not verify. Honest negative.
    ok = false;
    renderBadgeState("invalid");
  }

  // 10. Render the signed manifests -- ONLY after a valid signature, and ONLY
  //     outside the try above. Inside it, a render throw would be caught by the
  //     catch that renders "invalid", flipping a valid badge on a display bug.
  //     renderManifests() does not throw; this guard is belt-and-braces.
  if (ok) {
    try {
      renderManifests(envelope.canonical_form_b64);
    } catch {
      /* display-only; the badge above stands. */
    }
  }
}

// Expose COPY for the test harness to assert against (not used by production DOM).
export { COPY };
