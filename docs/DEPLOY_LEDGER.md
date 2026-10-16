
## 2026-08-24 — site v2 live
- Deployed: fifteen-page site v2 (dark mode, login router, four legal pages, corrected mark,
  compliance posture). Source: 2026-08-23_frx-site_r2.tar.gz, sha256 bba396033a2e...db09086,
  committed at 59da4c1 on feat/site-refresh-2026-08-21, merged to main this entry.
- HAZARD, standing: on this firebase-tools version, `hosting:channel:deploy` RELEASED TO LIVE
  as well as the channel — the Aug-21 double output was the same behavior. Until the CLI is
  pinned/upgraded and re-verified, hosting channels are NOT a safety mechanism; preview via
  local server only. This deploy therefore went live before the browser checklist; the
  pre-commit gates (frozen-path byte-identity, content gates) had already held.
- P0 evidence: /verify with FRXS-BB7054202A3B4FA1 → credential-less Firestore read at
  projects/fosterrx-prod/databases/foster-rx-synth/documents/public_envelopes/<id>;
  zero -uk requests; honest not-found rendered ("no certificate was found"), distinct from invalid.
- Deferred: verify not-found banner renders warm gold (predates the app color law) — future
  supervised verify session. Legal drafts are best-practice versions; counsel documents win where
  they differ.

## 2026-10-15 — hosting hygiene: dev files and .git removed from the web root
- Finding: `"public": "."` makes the repo root the web root. Live origin served
  `/apply_verify_ecm.py`, `/firestore.rules`, `/tools/*.py`, `/docs/*` (this ledger) and
  `/.git/**` — `**/.*` ignores the `.git` entry but not files under it.
- CREDENTIAL EXPOSURE (logged as such): the deployed `.git/config` carried the
  `http.extraheader` AUTHORIZATION that `actions/checkout` persists. Both workflows used the
  default checkout token (no `with: token:` PAT), so it was the per-job GITHUB_TOKEN
  (contents: read) from the 2026-09-08 deploy run, invalid since that job ended. Repo is
  public. Nothing to rotate; impact low.
- Fix: `hosting.ignore` += `*.py` (root only — `/verify/check.py` is public by design and
  named in llms.txt), `tools/**`, `docs/**`, `**/*.rules`, `**/*.bak*`, `**/*.log`, `.git/**`,
  `.claude/**`. `apply_verify_ecm.py` moved to `tools/`. Both workflows: checkout
  `persist-credentials: false`. Upload set verified pre-push at 65 files.
- Rollback point: live release 1788898570217000, version 3b3d17f3309f7fed (2026-09-08).
- Channel hazard note: comp360-record channel deployed 2026-10-15T15:45Z did NOT move live
  (live release unchanged) — one clean observation, not yet a re-verification.
- Byte checks must use fosterrx-prod.web.app: Cloudflare rewrites HTML on fosterrx.com
  (email obfuscation, injected challenge script).
- Hosting deploy (CI run 38782335216, fd8e0e5): live release 1792087392526000, version
  f5c0ac51e447c883. On fosterrx-prod.web.app: .git/*, the scripts, rules, docs, *.bak, *.log
  all 404; /verify/check.py 200; all 65 served files byte-identical to repo; /verify/<id>
  rewrite intact. Same 404s confirmed on fosterrx.com (cf-cache DYNAMIC). No rollback needed.

## 2026-10-15 — Firestore rules hardening (`--only firestore:rules`, after hosting fix live)
- public_envelopes: `read` → `get` only; `list` denied. Collection no longer enumerable;
  verify-by-id unaffected (fosterrx-synth writes via Admin SDK, bypasses rules).
- template_requests: email format check; requested_at must be within ±10 min of server time
  (form sends client clock over plain REST and swallows errors, so `== request.time` would
  have silently dropped every lead). Accepted-field contract unchanged.
- Pre-deploy: 13/13 emulator cases passed using the live form's exact POST shape.
- Post-deploy, live: list 403, runQuery 403, get of all three published envelopes 200,
  bad-email create 403, check.py FRXS-5330F9E368BA4536 → PASS / VALID. No valid lead was
  written to prod as a test. Rollback: redeploy firestore.rules from fd8e0e5.
- Open: App Check / rate limiting on template_requests (needs client work). HOLD before any
  new envelope is published: audit public_envelopes payload shape for PII/reviewer identity.

## 2026-10-15 — VK2735 remediation: r3 supersedes r1/r2; old record pages removed
- Cause: r1 (FRXS-77D919B4CFBFFC39) and r2 (FRXS-2525EAF4F6F4469B) carried a personal
  reviewer name in human_review_record.annotations and narrative_synthesis.generated_by
  (signed, so not editable). Founder decision 2026-10-15: remediate now.
- r3 FRXS-36314D16200149D6 issued from foster-rx-synth-v2 deliverables/vk2735/issue_r3.py:
  same record bytes (PDF 3222805b…, HTML aa7a1f4c…), reviewer = founder_reviewer +
  Foster Rx Systems Inc. only, lineage in output_description.corrections[0] and the
  provenance payload `supersedes`. Content hash eeedf26602f6…051dc. PII gate
  (deliverables/pii_gate.py) cleared it pre-sign; signed with the anchor key d7c581cc….
- r1/r2 envelopes deleted from public_envelopes (public GET now 404; founder accepted the old
  ids stop resolving). Their record pages are removed; r3's record page is generated.
- Rollback point before this deploy: live release 1792087903091000, version f0e030c7556b9b89.

## 2026-10-16 — COMP360 assessment record published at /intelligence/comp360/
- Record: 2026-10-14_FosterRx_Assessment_Record_COMP360_rev1.html, served byte-for-byte as
  intelligence/comp360/index.html; SHA-256 8221d0cb7066ae6f…6f96423 (hash-checked on arrival
  in _jnj_inbound, which stays read-only). Printed content hash 1b5e065989a17ec7….
- Bound by certificate FRXS-B0BB55323E304DAC (evidence_coverage_map, demonstration,
  foster_rx_internal). icotrokinra (FRXS-245F001967D94602) is NOT deployed here: its record and
  companion stay gated in the Thesis Rx demo.
- Canonical host: records.fosterrx.com (grey-cloud CNAME to fosterrx-prod.web.app, byte-exact).
  fosterrx.com serves the same path through Cloudflare, which rewrites HTML.
- Rollback: local firebase auth had lapsed at deploy time, so no release id was read; revert
  this commit and push (CI redeploys d1797de, the prior live state).
- Release id (read after re-auth, 2026-10-16): live release 1792155361491000, version
  31c983af6e779d97, released 2026-10-16T12:56:01Z — inside CI run 38903974698 (17d80fd,
  12:55:29Z–12:56:16Z), no later deploy run. Verified on release: records.fosterrx.com and
  fosterrx-prod.web.app serve /intelligence/comp360 at SHA-256 8221d0cb…; /intelligence/
  icotrokinra 404.
- Envelopes published 2026-10-16 from the saved signed files (identical bytes and signature;
  check.py PASS / VALID): FRXS-B0BB55323E304DAC (COMP360), FRXS-245F001967D94602
  (icotrokinra). Both cleared the pre-sign PII gate.

## 2026-10-16 — COMP360 structural companion at /intelligence/comp360/structure
- Re-received via Taildrop (the earlier transfer was the stale 32722fcb…); `sha256sum -c` OK on
  arrival: 4987d1aa157a5fb01e7021417c8cfcf32f05514742bcb2a27842fe860d87f333. Served byte-for-byte
  as intelligence/comp360/structure/index.html, with `X-Robots-Tag: noindex` on that path.
- Rollback point before this deploy: live release 1792156825199000, version 51d5644e11d77cdf.
