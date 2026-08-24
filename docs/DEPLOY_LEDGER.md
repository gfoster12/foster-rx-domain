
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
