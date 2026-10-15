
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
