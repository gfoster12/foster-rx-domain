/*
 * Dev-only fixture generator for the Foster Rx verify page test harness.
 * Phase 2.8 Workstream 2 — Step 4b.
 *
 * RUN MANUALLY ONLY:   node assets/verify/fixtures/_generate.js
 * NOT run in CI or deploy. The files it emits are committed so the test
 * corpus is reproducible; re-running regenerates a fresh test keypair.
 *
 * This script does NOT use any production signing code. It uses a freshly
 * generated Ed25519 keypair (the vendored @noble/ed25519) that is unrelated
 * to the production signing key. The synthetic payload is obviously-fake
 * test data — no production-shaped or partner data.
 *
 * It emits the envelope shape returned by the real API endpoint
 *   GET /v1/certificates/{cert_id}/envelope
 * namely { payload, canonical_form_b64, signature_hex,
 *          signing_key_fingerprint, signature_algorithm }
 * so the verifier exercises exactly the real response contract. The verifier
 * checks the signature over `canonical_form_b64` verbatim (see reconnaissance
 * OQ-1 / OQ-3), so the fixtures need only a self-consistent (canonical bytes,
 * signature, key) triple — they need not match the synth Pydantic schema.
 */

import * as ed from "../noble-ed25519.js";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROD_FINGERPRINT =
  "d7c581cc747dd7fbc06e247451a4b5b53eda4b41be017197aed6a874be2cd2e0";

// Ed25519 SubjectPublicKeyInfo DER prefix (12 bytes) — RFC 8410.
const SPKI_PREFIX = Uint8Array.from([
  0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
]);

const toHex = (u8) =>
  Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
const b64 = (u8) => Buffer.from(u8).toString("base64");

function spkiDer(rawPub32) {
  const der = new Uint8Array(SPKI_PREFIX.length + rawPub32.length);
  der.set(SPKI_PREFIX, 0);
  der.set(rawPub32, SPKI_PREFIX.length);
  return der;
}

function fingerprintOf(rawPub32) {
  return createHash("sha256").update(spkiDer(rawPub32)).digest("hex");
}

function pemOf(rawPub32) {
  const body = b64(spkiDer(rawPub32));
  const wrapped = body.match(/.{1,64}/g).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----\n`;
}

// Canonicalize like the synth signer (ADR-0015): recursively sorted keys,
// compact separators, UTF-8. Sufficient for self-consistent fixtures.
function canonicalize(obj) {
  const sort = (v) => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === "object") {
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => ((acc[k] = sort(v[k])), acc), {});
    }
    return v;
  };
  return new TextEncoder().encode(JSON.stringify(sort(obj)));
}

async function main() {
  const priv = ed.utils.randomPrivateKey();
  const pub = await ed.getPublicKeyAsync(priv); // raw 32-byte key
  const fingerprint = fingerprintOf(pub);

  if (fingerprint.toLowerCase() === PROD_FINGERPRINT.toLowerCase()) {
    throw new Error(
      "FATAL: generated test key matches the PRODUCTION fingerprint. Aborting."
    );
  }

  // Obviously-synthetic payload. Not the real cert schema; test data only.
  const payload = {
    certificate_id: "FRXS-0F1E2D3C-4B5A-4988-8776-655443322110",
    kind: "intelligence_report",
    status: "VALID",
    note: "SYNTHETIC TEST FIXTURE — not a real Foster Rx certificate",
    output_description: {
      kind: "intelligence_report",
      target: "TEST-TARGET",
      indication: "Synthetic indication (verify-page fixture)",
    },
    signature_algorithm: "ed25519",
    signing_key_fingerprint: fingerprint,
  };

  const canonical = canonicalize({
    certificate_id: payload.certificate_id,
    kind: payload.kind,
    status: payload.status,
    note: payload.note,
    output_description: payload.output_description,
  });
  const signature = await ed.signAsync(canonical, priv); // 64 bytes
  const sigHex = toHex(signature);
  const canonicalB64 = b64(canonical);

  // Sanity: the clean triple must verify true.
  const okClean = await ed.verifyAsync(signature, canonical, pub);
  if (!okClean) throw new Error("FATAL: clean fixture failed self-verify.");

  // valid-envelope.json — well-formed, signature valid.
  const validEnvelope = {
    payload,
    canonical_form_b64: canonicalB64,
    signature_hex: sigHex,
    signing_key_fingerprint: fingerprint,
    signature_algorithm: "ed25519",
  };

  // invalid-signature-envelope.json — same canonical bytes, one signature
  // byte flipped (New Finding 2: tamper the signature, not the payload).
  const flippedSigHex =
    ((parseInt(sigHex[0], 16) + 1) % 16).toString(16) + sigHex.slice(1);
  const invalidSigEnvelope = {
    ...validEnvelope,
    signature_hex: flippedSigHex,
  };

  // tampered-canonical-envelope.json — original signature, one canonical
  // byte flipped (New Finding 2: tamper the signed bytes themselves).
  const cBytes = Buffer.from(canonicalB64, "base64");
  cBytes[Math.floor(cBytes.length / 2)] ^= 0x01;
  const tamperedCanonEnvelope = {
    ...validEnvelope,
    canonical_form_b64: cBytes.toString("base64"),
  };

  // Confirm both negatives actually fail to verify.
  const okInvalidSig = await ed
    .verifyAsync(
      Uint8Array.from(Buffer.from(flippedSigHex, "hex")),
      canonical,
      pub
    )
    .catch(() => false);
  const okTamperedCanon = await ed.verifyAsync(
    signature,
    new Uint8Array(cBytes),
    pub
  );

  // NOTE: the PRIVATE key is intentionally NOT persisted. It is generated
  // fresh, used to sign the fixtures in-memory, and discarded. Only the public
  // half + fingerprint are written, so no key material is ever committed. The
  // harness only needs the public key to verify fixtures. (Re-running this
  // script mints a new ephemeral key and regenerates the whole corpus.)
  const keypair = {
    note: "DEV-ONLY TEST PUBLIC KEY — freshly generated, NOT the production key. Private key not persisted.",
    algorithm: "ed25519",
    public_key_hex: toHex(pub),
    public_key_pem: pemOf(pub),
    signing_key_fingerprint: fingerprint,
  };

  writeFileSync(join(HERE, "test-keypair.json"), JSON.stringify(keypair, null, 2) + "\n");
  writeFileSync(join(HERE, "valid-envelope.json"), JSON.stringify(validEnvelope, null, 2) + "\n");
  writeFileSync(join(HERE, "invalid-signature-envelope.json"), JSON.stringify(invalidSigEnvelope, null, 2) + "\n");
  writeFileSync(join(HERE, "tampered-canonical-envelope.json"), JSON.stringify(tamperedCanonEnvelope, null, 2) + "\n");

  console.log("Fixtures written to", HERE);
  console.log("  test public key fingerprint :", fingerprint);
  console.log("  production fingerprint       :", PROD_FINGERPRINT);
  console.log("  fingerprints differ          :", fingerprint.toLowerCase() !== PROD_FINGERPRINT.toLowerCase());
  console.log("  clean self-verify            :", okClean);
  console.log("  invalid-signature verifies   :", okInvalidSig, "(expect false)");
  console.log("  tampered-canonical verifies  :", okTamperedCanon, "(expect false)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
