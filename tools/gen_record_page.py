#!/usr/bin/env python3
"""Generate a static SIGNED PUBLIC RECORD page for a certificate.
Usage (from foster-rx-domain repo root):
    python3 tools/gen_record_page.py FRXS-XXXXXXXXXXXXXXXX [more ids...]
Fetches the public envelope via the credential-less Firestore REST path,
decodes the canonical bytes for the summary, and writes
verify/<ID>/record/index.html. Deploy with firebase deploy --only hosting.
No credentials, no repo internals: everything used here is world-readable.
"""
import base64, json, sys, urllib.request, pathlib, html

PROJECT = "fosterrx-prod"; DB = "foster-rx-synth"
ANCHOR_FP = "d7c581cc747dd7fbc06e247451a4b5b53eda4b41be017197aed6a874be2cd2e0"
ANCHOR_PEM = """-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAJzS5+VW5os64mO/8Lh0ITON1YZPoY9AVTbMvRSGR3Hk=
-----END PUBLIC KEY-----"""

def fetch_envelope(cert_id):
    url = ("https://firestore.googleapis.com/v1/projects/%s/databases/%s/"
           "documents/public_envelopes/%s" % (PROJECT, DB, cert_id))
    doc = json.load(urllib.request.urlopen(url))
    f = doc["fields"]
    def s(k): return f[k]["stringValue"]
    return {"signature_algorithm": s("signature_algorithm"),
            "signing_key_fingerprint": s("signing_key_fingerprint"),
            "signature_hex": s("signature_hex"),
            "canonical_form_b64": s("canonical_form_b64"), "rest_url": url}

def summarize(canonical):
    c = canonical; od = c.get("output_description") or {}
    rec = c.get("human_review_record") or {}; narr = c.get("narrative_synthesis") or {}
    rows = [("Kind", c.get("kind")), ("Status", c.get("status")),
            ("Issued", c.get("issued_at")), ("License tier", c.get("license_tier")),
            ("Human review", "%s · %s" % (rec.get("reviewer_role"), rec.get("decision")))]
    extra = []
    if od.get("kind") == "evidence_coverage_map":
        cov = od.get("coverage") or {}
        rows.append(("Coverage", "%s complete · %s partial · %s analytical · %s no-data across %s sections"
                     % (cov.get("complete"), cov.get("partial"), cov.get("analytical", 0),
                        cov.get("no_data", 0), cov.get("sections_total", 25))))
        rows.append(("Bound report", "PDF, %s pages · SHA-256 %s" % (od.get("report_page_count"), od.get("report_pdf_hash"))))
        for a in od.get("companion_artifacts") or []:
            rows.append(("Companion", "%s · SHA-256 %s" % (a.get("name"), a.get("sha256"))))
        for corr in od.get("corrections") or []:
            extra.append(("Correction / supersession", corr))
    if narr.get("summary"):
        extra.append(("Reviewer narrative", "\u201c%s\u201d" % narr["summary"]))
    if rec.get("annotations"):
        extra.append(("Review annotation", rec["annotations"]))
    return rows, extra

TPL = """<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Foster Rx Certificate {ID} \u2014 Signed Public Record</title>
<style>body{{background:#FAF8F2;color:#20211F;font:16px/1.6 Georgia,serif;max-width:60rem;margin:0 auto;padding:3rem 1.5rem}}
h1,h2{{color:#1E3D37;font-weight:700}}h1{{font-size:1.9rem}}h2{{font-size:1.2rem;margin-top:2.2rem}}
.chip{{display:inline-block;background:#A8D9CC;color:#1E3D37;font:700 .72rem/1 monospace;letter-spacing:.08em;padding:.45em .8em;border-radius:3px}}
dl{{display:grid;grid-template-columns:11rem 1fr;gap:.4rem 1rem}}dt{{color:#5C6B65}}dd{{margin:0;font-family:monospace;font-size:.92rem;overflow-wrap:anywhere}}
pre{{background:#fff;border:1px solid #DCE5E0;border-radius:6px;padding:1rem;font-size:.8rem;overflow-wrap:anywhere;white-space:pre-wrap}}
.muted{{color:#5C6B65;font-size:.92rem}}footer{{margin-top:3rem;border-top:1px solid #DCE5E0;padding-top:1rem;font-size:.85rem;color:#5C6B65}}
a{{color:#1E3D37}}</style></head><body>
<h1>Foster Rx Certificate {ID}</h1><p><span class="chip">SIGNED PUBLIC RECORD</span></p>
<p>This page contains the complete signed envelope for certificate <code>{ID}</code>, embedded as static
text so that any reader \u2014 human, crawler, or AI agent \u2014 can retrieve it in a single fetch and
<b>verify the signature independently</b>. The embedded data is a convenience copy; trust derives only
from the Ed25519 signature checking out against the published anchor. Nothing on this page needs to be
believed \u2014 it can be checked.</p>
<h2>Record summary (decoded from the signed bytes below)</h2><dl>{ROWS}</dl>{EXTRA}
<h2>Public envelope (verify against this, not against us)</h2>
<pre>signature_algorithm: {ALG}
signing_key_fingerprint: {FP}
signature_hex: {SIG}
canonical_form_b64: {B64}</pre>
<h2>Trust anchor \u2014 convenience copy (canonical at /.well-known/)</h2>
<p class="muted">Canonical: <a href="/.well-known/angis-signing-key-v1.pub">/.well-known/angis-signing-key-v1.pub</a> \u2014 prefer it if reachable; either way the key must hash (SHA-256 over its DER SubjectPublicKeyInfo) to the fingerprint above.</p>
<pre>{PEM}</pre>
<h2>How to verify \u2014 machine instructions</h2>
<pre>1. GET https://fosterrx.com/.well-known/angis-signing-key-v1.pub   (Ed25519 public key, PEM/SPKI)
2. Fingerprint = SHA-256 over the DER SubjectPublicKeyInfo bytes; must equal
   {FP}
3. message = base64_decode(canonical_form_b64); signature = hex_decode(signature_hex)
4. ed25519_verify(public_key, signature, message) \u2192 must be VALID
5. The record fields ARE the decoded message. Anything this page claims, re-derive from those bytes.</pre>
<h2>Other verification paths</h2>
<p class="muted">Interactive (in-browser crypto): <a href="/verify/{ID}">fosterrx.com/verify/{ID}</a><br>
Envelope via public REST (no key): <a href="{REST}">{RESTSHORT}</a><br>
AI-assistant connector (Model Context Protocol): fosterrx-verify-mcp \u00b7 source on GitHub (gfoster12/fosterrx-verify-mcp)</p>
<footer>Foster Rx Systems Inc. \u00b7 Patent Pending No. 19/459,855 \u00b7 This record is permanent: verification is free,
requires no account, and does not depend on any Foster Rx server being reachable \u2014 only on the mathematics above.</footer>
</body></html>"""

def main():
    for cert_id in sys.argv[1:]:
        env = fetch_envelope(cert_id)
        canonical = json.loads(base64.b64decode(env["canonical_form_b64"]))
        assert canonical.get("certificate_id") == cert_id, "canonical id mismatch"
        rows, extra = summarize(canonical)
        rows_html = "".join("<dt>%s</dt><dd>%s</dd>" % (html.escape(str(k)), html.escape(str(v))) for k, v in rows)
        extra_html = "".join("<p class=\"muted\"><b>%s:</b> %s</p>" % (html.escape(k), html.escape(str(v))) for k, v in extra)
        page = TPL.format(ID=cert_id, ROWS=rows_html, EXTRA=extra_html, ALG=env["signature_algorithm"],
                          FP=env["signing_key_fingerprint"], SIG=env["signature_hex"],
                          B64=env["canonical_form_b64"], PEM=ANCHOR_PEM,
                          REST=env["rest_url"], RESTSHORT="firestore.googleapis.com/\u2026/public_envelopes/" + cert_id)
        out = pathlib.Path("verify") / cert_id / "record" / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page)
        print("WROTE", out, "| fp", env["signing_key_fingerprint"][:16],
              "| anchor match:", env["signing_key_fingerprint"] == ANCHOR_FP)

if __name__ == "__main__":
    main()
