#!/usr/bin/env python3
"""Foster Rx independent certificate check - PASS/FAIL, no trust in this script required:
read it, it only fetches public material and runs standard Ed25519 verification.
Usage: python3 check.py FRXS-5330F9E368BA4536        (needs: pip install cryptography)
Or:    python3 <(curl -s https://fosterrx.com/verify/check.py) FRXS-5330F9E368BA4536
"""
import sys, json, base64, hashlib, urllib.request

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; fosterrx-check/1.1)"})
    return urllib.request.urlopen(req, timeout=20).read()

def main():
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(2)
    cid = sys.argv[1].strip()
    env_url = ("https://firestore.googleapis.com/v1/projects/fosterrx-prod/"
               "databases/foster-rx-synth/documents/public_envelopes/" + cid)
    doc = json.loads(get(env_url))
    f = doc["fields"]
    b64 = f["canonical_form_b64"]["stringValue"]
    sig = f["signature_hex"]["stringValue"]
    fp_claimed = f["signing_key_fingerprint"]["stringValue"]
    try:
        pem = get("https://fosterrx.com/.well-known/angis-signing-key-v1.pub")
    except Exception:
        # edge/bot rules may block raw key fetch; the static page embeds a
        # same-origin convenience copy - extract it and proceed identically
        page = get("https://fosterrx.com/verify/" + cid + "/").decode()
        import re
        m = re.search(r"-----BEGIN PUBLIC KEY-----.*?-----END PUBLIC KEY-----", page, re.S)
        if not m:
            print("FAIL: trust anchor unreachable and not embedded"); sys.exit(1)
        pem = m.group(0).encode()
        print("note: anchor read from same-origin page copy (raw key fetch blocked)")
    try:
        from cryptography.hazmat.primitives.serialization import (
            load_pem_public_key, Encoding, PublicFormat)
    except ImportError:
        print("NEEDS: pip install cryptography"); sys.exit(2)
    pk = load_pem_public_key(pem)
    der = pk.public_bytes(Encoding.DER, PublicFormat.SubjectPublicKeyInfo)
    fp = hashlib.sha256(der).hexdigest()
    print("fingerprint (sha256 over DER SPKI):", fp)
    print("fingerprint matches envelope:      ", "PASS" if fp == fp_claimed else "FAIL")
    canonical = base64.b64decode(b64)
    try:
        pk.verify(bytes.fromhex(sig), canonical)
        ok = True
    except Exception:
        ok = False
    print("ed25519 signature over %d bytes:    %s" % (len(canonical), "PASS" if ok else "FAIL"))
    rec = json.loads(canonical)
    print("certificate_id:", rec.get("certificate_id"), "| status:", rec.get("status"),
          "| kind:", rec.get("kind"))
    sys.exit(0 if (ok and fp == fp_claimed) else 1)

if __name__ == "__main__":
    main()
