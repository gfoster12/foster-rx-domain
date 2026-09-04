"""ADR-0064 G3: teach the public verify page the evidence_coverage_map kind.
Run from foster-rx-domain repo root:  python3 apply_verify_ecm.py
Discovery-driven, sentinel-idempotent, .bak backup, count-asserted anchors.
Render fault must never flip the badge: the whole branch is try/catch'd and
sits inside renderManifests, which the caller already guards.
"""
import pathlib, re, shutil, sys

F = pathlib.Path("assets/verify/verify.js")
src = F.read_text()

if 'evidence_coverage_map' in src:
    sys.exit("SENTINEL: evidence_coverage_map already handled; nothing to do.")

ANCHOR = 'if (od.kind === "synthetic_data") {'
assert src.count(ANCHOR) == 1, "ANCHOR FAIL: synthetic_data dispatch not unique. Paste: sed -n '410,470p' assets/verify/verify.js"

# discover the manifest container + class conventions from renderManifests itself
fn_start = src.index("export function renderManifests")
region = src[fn_start: src.index(ANCHOR)]
m_host = re.search(r'getElementById\(\s*"([^"]+)"\s*\)', region) or re.search(r'querySelector\(\s*"([^"]+)"\s*\)', region)
assert m_host, "DISCOVERY FAIL: no container lookup found before dispatch. Paste: sed -n '414,445p' assets/verify/verify.js"
sel = m_host.group(1)
host_expr = ('document.getElementById("%s")' % sel) if m_host.re.pattern.startswith("getElementById") else ('document.querySelector("%s")' % sel)

after = src[src.index(ANCHOR): src.index(ANCHOR) + 2600]
classes = re.findall(r'mkEl\(\s*"(h\d|p|div|ul|li|span)"\s*,\s*"([^"]*)"', after)
head_cls = next((c for t, c in classes if t.startswith("h")), "")
body_cls = next((c for t, c in classes if t == "p"), "")
item_cls = next((c for t, c in classes if t == "li"), body_cls)
print("discovered: container=%r heading_class=%r body_class=%r item_class=%r" % (sel, head_cls, body_cls, item_cls))

BRANCH = '''    if (od.kind === "evidence_coverage_map") {
      // ADR-0064 G3. All values from the decoded canonical (signed bytes).
      // Defensive: a render fault here must never disturb the badge.
      try {
        const host = %(HOST)s;
        const H = (t) => host.appendChild(mkEl("h3", %(HC)r, t));
        const P = (t) => host.appendChild(mkEl("p", %(BC)r, t));
        const LIST = (items) => {
          const ul = mkEl("ul", "");
          for (const it of items || []) ul.appendChild(mkEl("li", %(IC)r, it));
          host.appendChild(ul);
        };
        const rec = canonical.human_review_record || {};
        const narr = canonical.narrative_synthesis || {};
        H("Review");
        P([rec.reviewer_role, rec.decision, rec.reviewer_org,
           String(rec.review_timestamp || "").slice(0, 10)].filter(Boolean).join(" \\u00b7 "));
        if (rec.annotations) P(rec.annotations);
        if (narr.summary) P(narr.summary);
        const cov = od.coverage || {};
        H("Coverage");
        P([cov.complete, "complete \\u00b7", cov.partial, "partial \\u00b7",
           cov.analytical, "analytical \\u00b7", cov.evidence_insufficient || 0,
           "evidence-insufficient \\u00b7", cov.no_data || 0, "no-data \\u2014 across",
           cov.sections_total || 25, "sections.",
           "Snapshot", od.snapshot_date + ";", od.passes, "passes;",
           od.formal_silences, "formal silences;", od.conflicts_both_sided,
           "both-sided conflicts."].join(" "));
        if ((od.findings || []).length) { H("Findings"); LIST(od.findings); }
        if ((od.open_items || []).length) { H("Open items"); LIST(od.open_items); }
        H("Sources");
        P(String(od.sources_consulted) + " sources consulted this pass. The full source register is itemized inside the bound report below; the signature above covers those bytes.");
        H("Methodology");
        P("Conclusion-free by schema: this certificate kind attests coverage, findings, and stated silences \\u2014 it carries no score, valuation, or recommendation. Analytical values inside the bound report print their methodology identifier and validation status alongside.");
        H("Bound artifacts");
        const arts = [];
        if (od.report_pdf_hash) arts.push("Primary report (PDF, " + od.report_page_count + " pages) \\u00b7 SHA-256 " + od.report_pdf_hash);
        for (const a of od.companion_artifacts || []) {
          arts.push(a.name + " (" + a.media_type + ") \\u00b7 SHA-256 " + a.sha256);
        }
        LIST(arts);
        if ((od.corrections || []).length) { H("Corrections & supersession"); LIST(od.corrections); }
      } catch (e) {
        const host = %(HOST)s;
        if (host) host.appendChild(mkEl("p", %(BC)r, COPY.manifests.unavailable));
      }
      return;
    }
''' % {"HOST": host_expr, "HC": head_cls, "BC": body_cls, "IC": item_cls}

shutil.copy(F, str(F) + ".bak-ecm")
F.write_text(src.replace(ANCHOR, BRANCH + "    " + ANCHOR, 1))
new = F.read_text()
line = new[: new.index('od.kind === "evidence_coverage_map"')].count("\\n") + 1
print("INSERTED evidence_coverage_map branch near line", line)
print("NEXT: firebase serve  ->  http://localhost:5000/verify/FRXS-2525EAF4F6F4469B")
