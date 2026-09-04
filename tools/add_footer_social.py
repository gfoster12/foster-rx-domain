#!/usr/bin/env python3
"""Add GitHub + LinkedIn logo buttons under the footer location line, site-wide.
Run from foster-rx-domain repo root:  python3 tools/add_footer_social.py
Sentinel-idempotent (skips already-patched files); anchors on the location line;
loud per-file failure so nothing half-patches.
"""
import pathlib, re, sys

SENTINEL = 'class="footer-social"'
BLOCK = (
    '\n<div class="footer-social" style="display:flex;gap:14px;margin-top:16px">'
    '<a href="https://github.com/Foster-Rx" aria-label="Foster Rx on GitHub" '
    'style="color:#6F958E;transition:color .15s" '
    'onmouseover="this.style.color=\'#FAF8F2\'" onmouseout="this.style.color=\'#6F958E\'">'
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    '<path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/>'
    '</svg></a>'
    '<a href="https://www.linkedin.com/company/foster-rx-systems" aria-label="Foster Rx on LinkedIn" '
    'style="color:#6F958E;transition:color .15s" '
    'onmouseover="this.style.color=\'#FAF8F2\'" onmouseout="this.style.color=\'#6F958E\'">'
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>'
    '</svg></a></div>'
)

# match the location line and capture its closing tag, whatever element it uses
PAT = re.compile(r'(Annapolis,\s*Maryland\s*</[a-zA-Z0-9]+>)')

files = [pathlib.Path(p) for p in [
    "platform/index.html","legal/privacy/index.html","legal/index.html",
    "legal/services-agreement/index.html","legal/terms/index.html","legal/cookies/index.html",
    "index.html","capital-rx/index.html","thesis-rx/index.html","about/index.html",
    "thesis/index.html","login/index.html","angis/index.html","trust/index.html",
    "design-partners/index.html",
]]

patched, skipped, failed = 0, 0, []
for f in files:
    s = f.read_text()
    if SENTINEL in s:
        skipped += 1; print("skip (already patched):", f); continue
    hits = PAT.findall(s)
    if len(hits) != 1:
        failed.append((f, len(hits))); continue
    s = PAT.sub(lambda m: m.group(1) + BLOCK, s, count=1)
    f.write_text(s); patched += 1; print("patched:", f)

print("\n%d patched, %d already-done" % (patched, skipped))
if failed:
    print("\nFAILED (location-line match count != 1) - paste these back:")
    for f, n in failed:
        print("  %s  (matches=%d)  ->  grep -n 'Annapolis' %s" % (f, n, f))
    sys.exit(1)
print("all target files done")
