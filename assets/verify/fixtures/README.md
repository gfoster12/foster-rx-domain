# Verify-page test fixtures (dev-only, NOT deployed)

These files support the verify-page test harness (`/verify/_test.html`). They are
**excluded from production and preview deploys** via `firebase.json` `ignore`
rules (added in Step 4b Phase B): `assets/verify/fixtures/**`.

## What's here

| File | Purpose |
|------|---------|
| `_generate.js` | Generation script. Run **manually only** (never in CI/deploy). |
| `test-keypair.json` | The **public** half of a fresh test Ed25519 key + its fingerprint. **No private key is persisted** (see below). |
| `valid-envelope.json` | Well-formed envelope, signature valid against the test key → expect **Signature valid**. |
| `invalid-signature-envelope.json` | Same canonical bytes, one **signature** byte flipped → expect **Signature not valid**. |
| `tampered-canonical-envelope.json` | Original signature, one **canonical_form_b64** byte flipped → expect **Signature not valid**. |

The two negative fixtures tamper the *signature* and the *signed bytes*
respectively — not the `payload` — because verification runs over
`canonical_form_b64`, not over the displayed payload (reconnaissance New
Finding 2). Flipping a payload field alone would not change the verify result.

## Regenerating

```
node assets/verify/fixtures/_generate.js
```

The script:
- mints a **fresh** Ed25519 keypair (unrelated to production),
- signs a small **synthetic** payload (obviously-fake test data — no
  production-shaped or partner data),
- emits the envelope shape returned by the real API
  (`{ payload, canonical_form_b64, signature_hex, signing_key_fingerprint,
  signature_algorithm }`),
- asserts the test key's fingerprint **differs** from the production trust
  anchor (`d7c581cc…d2e0`) and aborts if it ever matched,
- writes only the **public** key + fingerprint to `test-keypair.json`; the
  **private key is generated in memory, used to sign, and discarded** — it is
  never written to disk, so no key material is committed.

Re-running mints a new key and rewrites the whole corpus; the committed files
are the canonical test corpus. The harness reads the public key/fingerprint
from `test-keypair.json`, so regeneration stays self-consistent.

## Running the harness

Module imports + `fetch` require an http server (not `file://`):

```
python3 -m http.server 8099   # from the repo root
# then open http://localhost:8099/verify/_test.html
```
