# Phase 2.8 — Verify Page Customer-Visible Prose Draft (Step 4a)

**Status:** REVISED PER FOUNDER REVIEW (Step 4a revisions applied — all six flagged items
resolved; see CHANGELOG at the foot of this document). No code is written until these strings
are approved. Step 4b builds against the strings approved here.

**Repo:** `foster-rx-domain` (static Firebase site). **Scope:** Path Z (signature
verification) **+ Step 4c manifest rendering** — the 1.A follow-up anticipated in the Step 4a
CHANGELOG has landed. Itemized source and methodology provenance now renders beneath a valid
badge, read from the signed canonical bytes.

**Governance legend:**
- **I-1 (honest emptiness):** does the string accurately represent the data state, or overclaim?
- **I-5 (patent-safe):** none of "decision intelligence", "eight-stage pipeline", "PHI exclusion",
  "knowledge graph construction", "feature engineering", "probabilistic pattern analysis".
- **I-15 (no internal/partner names):** no `description_internal`, no partner names
  (Elucidata, MMIT, Norstella, ArcLight, OptimusKG, HDIG, Pharvaris, …).

Each check column: ✓ = pass. After the Step 4a revision pass, **no ⚠ flags remain** — all six
founder-flagged items are resolved (CHANGELOG, foot of document).

A string ID convention is used (`S#`, `L#`, `B#`, `E#`, …) so each line is reviewable in
isolation and can be referenced unambiguously in code review.

**Inventory summary (post-revision):** 46 customer-visible strings.

| Section | Strings | IDs |
|---------|---------|-----|
| §1 Static structure | 8 | S1–S8 |
| §2 Landing state | 7 | L1–L7 |
| §3 Cert ID display | 2 | C1–C2 |
| §4 Badge — all states | 12 | B1–B6 (label + explanation each) |
| §5 "What this verifies" | 3 | W1–W3 |
| §6 "What this does not verify" | 2 | N1–N2 |
| §7 Error states (new body strings) | 6 | E2, E3, E4, E7, E8, E10 |
| §8 Footer | 6 | F1–F4, F6, F8 |
| **Total** | **46** | (link-target rows excluded as non-visible) |

E1/E5/E6/E9 reuse landing/badge strings (cross-referenced, not re-counted). The badge label
"Unable to verify" is reused across B4/B5/B6 by design, so 46 entries map to 44 textually
unique strings.

---

## 1. Static page structure

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| S1 | Browser tab `<title>` | `Verify a certificate — Foster Rx` | ✓ | ✓ | ✓ |
| S2 | Page heading (`h1`) | `Verify a Foster Rx certificate` | ✓ | ✓ | ✓ |
| S3 | Subheader / tagline | `Cryptographically verify the signature on a Foster Rx ANGIS certificate, in your browser.` | ✓ | ✓ | ✓ |
| S4 | Section label | `Certificate ID` | ✓ | ✓ | ✓ |
| S5 | Section label | `Verification status` | ✓ | ✓ | ✓ |
| S6 | Section label | `What this verifies` | ✓ | ✓ | ✓ |
| S7 | Section label | `What this does not verify` | ✓ | ✓ | ✓ |
| S8 | Section label | `How verification works` | ✓ | ✓ | ✓ |

Notes:
- S3 deliberately says "verify the signature," not "validate the certificate" — keeps the claim
  scoped to what Path Z actually does (I-1).
- "ANGIS" is a Foster Rx product name, not a partner name — permitted under I-15.

---

## 2. Bare `/verify` landing state (OQ-7)

Shown when no certificate ID is present in the URL (`/verify` with no path segment).

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| L1 | Landing heading | `Verify a certificate` | ✓ | ✓ | ✓ |
| L2 | Instructional copy | `Foster Rx ANGIS certificates carry a cryptographic signature. Enter a certificate ID below to verify that signature against Foster Rx's published signing key.` | ✓ | ✓ | ✓ |
| L3 | Input label | `Certificate ID` | ✓ | ✓ | ✓ |
| L4 | Input placeholder | `FRXS-XXXXXXXXXXXXXXXX` | ✓ | ✓ | ✓ |
| L5 | Submit button | `Verify` | ✓ | ✓ | ✓ |
| L6 | "How to verify" guidance heading | `Where do I find a certificate ID?` | ✓ | ✓ | ✓ |
| L7 | "How to verify" guidance body | `A certificate ID appears on the Foster Rx ANGIS certificate you received. It begins with "FRXS-" followed by a string of letters and numbers. Paste the whole ID exactly as it appears, including the "FRXS-" prefix.` | ✓ | ✓ | ✓ |

Notes:
- **CORRECTED (Step 4c).** The earlier note cited a 41-char `FRXS-` + UUID shape "confirmed from
  the signer (`core/certificate.py:383`)". That line is `certificate_id`'s **default_factory**,
  which fires only when a Certificate is built with no explicit id. Every production call site —
  `api/certificate_builder.py:66`, `api/app.py:956`, `api/v1/intelligence/certify_brief.py:255`,
  `pipeline/full_pipeline.py:714` — issues `FRXS-<16 hex, no dashes>`. Every certificate in the
  GCS archive carries that form. The same inference reached the verifier's `CERT_ID_RE`, which
  therefore rejected every real certificate with "That doesn't look like a Foster Rx certificate
  ID"; fixed 2026-08-01. L7 now describes the format loosely rather than asserting a length, so
  the guidance cannot go stale against either form.
- Placeholder text is illustrative only; not a real ID.
- Landing context link (former L8/L9) **dropped** per founder decision (Item 2). The landing page
  stands alone; L7 ends the guidance cleanly with no stranded reference.

---

## 3. Certificate ID display

Shown when a certificate ID is present and being processed.

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| C1 | Field label | `Certificate ID` | ✓ | ✓ | ✓ |
| C2 | Value presentation | (the certificate ID rendered verbatim, uppercase preserved, hyphen separators intact, monospace) — e.g. `FRXS-1A2B3C4D5E6F4A8B` | ✓ | ✓ | ✓ |

Notes:
- C2 renders the ID exactly as supplied (uppercased to match the canonical `FRXS-` form before
  display and before fetch). No transformation that changes meaning. It is a presented value, not
  authored prose — no governance claim attaches to it.

---

## 4. Signature badge — all states

The badge is the primary signal. Each state carries a short badge label + a one-line explanation.
Color is never the sole signal (icon + text always present).

| ID | State | Badge label | Explanation line | I-1 | I-5 | I-15 |
|----|-------|-------------|------------------|-----|-----|------|
| B1 | Pending / loading | `Verifying signature…` | `Checking this certificate's signature against Foster Rx's published signing key.` | ✓ | ✓ | ✓ |
| B2 | Valid | `Signature valid` | `This certificate was signed by Foster Rx's published ANGIS signing key.` | ✓ | ✓ | ✓ |
| B3 | Invalid | `Signature not valid` | `This certificate's signature does not verify against Foster Rx's published key. If you obtained this certificate through official channels, contact Foster Rx — there may be an issue with the certificate or the verification process.` | ✓ | ✓ | ✓ |
| B4 | Unable to verify — key mismatch | `Unable to verify` | `This certificate names a signing key that does not match Foster Rx's currently published key. We did not attempt signature verification.` | ✓ | ✓ | ✓ |
| B5 | Unable to verify — signature missing | `Unable to verify` | `This certificate does not carry a signature, so there is nothing to verify.` | ✓ | ✓ | ✓ |
| B6 | Error — fetching certificate | `Unable to verify` | `We couldn't retrieve this certificate to verify it. Please check the certificate ID and try again.` | ✓ | ✓ | ✓ |

Notes:
- B2 says "signed by … signing key" — the precise, defensible claim. It does **not** say
  "authentic" or "trustworthy" (per the founder's stated honesty-over-polish constraint).
- B3 wording revised to an **investigative** tone (Item 4): states the cryptographic fact
  ("does not verify") and directs the holder to contact Foster Rx, rather than implying the
  certificate is fake. Honest about the failure without being accusatory toward a blameless
  holder. The principle (honesty about *what is verified* ≠ pessimistic tone toward the holder)
  is now applied across the document.
- B4 vs B6: B4 is the fingerprint cross-check failing *before* verification (OQ-5); B6 is a
  retrieval/transport failure. Both render the neutral "Unable to verify" label but with distinct
  explanations, so the user can tell a key-policy condition from a transient error.
- All "Unable to verify" states (B4/B5/B6) deliberately share the **same neutral label** so a
  transient or policy condition is never visually conflated with B3 ("not valid"), which is a
  cryptographic negative. This is an I-1 decision: we never show a red "not valid" when we did not
  actually evaluate the signature to false.

---

## 5. "What this verifies" explanatory copy

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| W1 | Body paragraph | `A "Signature valid" result means Foster Rx's published ANGIS signing key produced the signature on this certificate. Because only Foster Rx holds the corresponding private key, a valid signature confirms the certificate was issued by Foster Rx and has not been altered since it was signed.` | ✓ | ✓ | ✓ |
| W2 | Body paragraph | `The check runs entirely in your browser. Your browser fetches Foster Rx's published Ed25519 signing key from fosterrx.com and verifies the certificate's signature against it. No third party is involved, and no personal data is transmitted.` | ✓ | ✓ | ✓ |
| W3 | Body paragraph | `Before verifying, the page confirms that the signing-key fingerprint named in the certificate matches the fingerprint of Foster Rx's currently published key. If they differ, the page reports that it cannot verify rather than checking against the wrong key.` | ✓ | ✓ | ✓ |

Notes:
- W1 makes the provenance claim ("issued by Foster Rx and not altered since signing") — this is
  accurate for a raw Ed25519 signature over the canonical bytes. It does **not** claim anything
  about the findings (that's §6).
- W2 revised (Item 5): the imprecise "nothing is sent anywhere" claim is replaced with "No third
  party is involved, and no personal data is transmitted." This is accurate — verification fetches
  the certificate envelope and the trust anchor from Foster Rx's own service (no third party), and
  no user/personal data is transmitted.
- W2 names "Ed25519" — a precise public cryptographic standard, not internal/patent language. ✓ I-5.

---

## 6. "What this does not verify" — honest-emptiness copy (I-1 critical)

This is the load-bearing section under Path Z.

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| N1 | Body paragraph | `A valid signature confirms who issued this certificate — Foster Rx — and that it has not been altered. It does not, by itself, attest to the accuracy or correctness of the findings the certificate describes.` | ✓ | ✓ | ✓ |
| N2 | Body paragraph | `When a certificate's signature is valid, this page lists the sources and methodologies recorded in it. Those entries are part of the signed certificate, so the signature check covers them. Confirming that a source is listed is not the same as confirming that the finding drawn from it is correct.` | ✓ | ✓ | ✓ |
| N3 | Body paragraph | `Not every certificate itemizes sources and methodologies, and some certificate types do not carry them at all. Where a list is absent, this page says so rather than omitting the section.` | ✓ | ✓ | ✓ |

Notes:
- N1 is the core honest-emptiness statement: provenance ≠ truth of findings. Direct, no hedging.
- **N2 revised (Step 4c).** Manifests now render, so the deferral language is retired. The
  replacement makes the binding claim explicitly — "those entries are part of the signed
  certificate, so the signature check covers them" — and then immediately re-scopes it: a listed
  source is not a correct finding. N1 and N2 together keep provenance and truth separate.
- **N3 RESTORED (Step 4c).** Step 4a folded N3 out with the note that the payload-binding
  disclaimer "re-enters when the 1.A follow-up wires manifest rendering." It has. But the answer
  turned out stronger than a disclaimer: the page decodes and renders `canonical_form_b64` —
  the exact bytes the signature covers — rather than a parallel copy that could drift from them.
  There is therefore no binding gap to disclaim. N3 instead carries the honest-emptiness case
  that manifest rendering newly creates: absent and not-applicable manifests must be *stated*,
  not silently omitted, or an empty section would read as a page failure.
- The three manifest render states (present / absent-or-empty / not-applicable) are inventoried
  as M1–M8 in §9.
- **Methodology-documentation links (former N4/N5/N6) dropped (Item 1).** No confirmed public
  methodology-documentation URL exists; linking to a placeholder would imply documentation that
  isn't published (I-1). The footer fingerprint/PEM links (F6–F9) remain for technical verifiers.

---

## 7. Error states — exact user-visible copy

Each error renders in the badge area (label from §4 where applicable) plus a body line with
next-step guidance.

| ID | Trigger | Badge label | Body / next-step copy | I-1 | I-5 | I-15 |
|----|---------|-------------|------------------------|-----|-----|------|
| E1 | Empty cert_id (bare `/verify`) | (no badge) | Handled by the landing state — see §2 (L1–L7). | ✓ | ✓ | ✓ |
| E2 | Malformed cert_id (doesn't match `FRXS-` format) | `Unable to verify` | `That doesn't look like a Foster Rx certificate ID. A valid ID begins with "FRXS-". Please check the ID and try again.` | ✓ | ✓ | ✓ |
| E3 | Certificate not found (404) | `Unable to verify` | `No certificate was found for this ID. Please check that you entered it correctly.` | ✓ | ✓ | ✓ |
| E4 | Network error (API unreachable, CORS, DNS) | `Unable to verify` | `We couldn't reach the Foster Rx certificate service. Please check your connection and try again.` | ✓ | ✓ | ✓ |
| E5 | Fingerprint mismatch | `Unable to verify` | (badge B4 explanation) `This certificate names a signing key that does not match Foster Rx's currently published key. We did not attempt signature verification.` | ✓ | ✓ | ✓ |
| E6 | Signature verification failed (verify → false) | `Signature not valid` | (badge B3 explanation) `This certificate's signature does not verify against Foster Rx's published key. If you obtained this certificate through official channels, contact Foster Rx — there may be an issue with the certificate or the verification process.` | ✓ | ✓ | ✓ |
| E7 | Trust anchor PEM fetch failed | `Unable to verify` | `We couldn't load Foster Rx's published signing key, so we can't verify this certificate right now. Please try again shortly.` | ✓ | ✓ | ✓ |
| E8 | Trust anchor fingerprint file fetch failed | `Unable to verify` | `We couldn't load Foster Rx's published signing-key fingerprint, so we can't verify this certificate right now. Please try again shortly.` | ✓ | ✓ | ✓ |
| E9 | Unsigned certificate (`signature_hex` empty) | `Unable to verify` | (badge B5 explanation) `This certificate does not carry a signature, so there is nothing to verify.` | ✓ | ✓ | ✓ |
| E10 | Envelope JSON parse failure | `Unable to verify` | `We received an unexpected response while retrieving this certificate. Please try again shortly.` | ✓ | ✓ | ✓ |

Notes:
- E7 and E8 are split because the fingerprint cross-check (OQ-5) fetches a *separate* artifact
  (`.well-known/angis-signing-key-v1.pub.fingerprint`) from the PEM (`…v1.pub`). Distinct failure,
  distinct copy — but both are transient "try again" conditions, so they share the neutral label.
- E2 distinguishes "malformed" (client-side format gate) from E3 "not found" (real 404). Both are
  honest; E2 never claims the cert is invalid, only that the *ID* is malformed.
- E6 = B3; E5 = B4; E9 = B5 (cross-referenced to avoid string drift — single source of truth in §4).

---

## 8. Footer & attribution

Mirrors the existing site footer conventions (`index.html`).

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| F1 | Org line | `Foster Rx Systems Inc.` | ✓ | ✓ | ✓ |
| F2 | Patent notice | `Patent Pending No. 19/459,855` | ✓ | ✓ | ✓ |
| F3 | Build attribution | `Built by Foster Rx Systems Inc.` | ✓ | ✓ | ✓ |
| F4 | Home link label | `fosterrx.com` | ✓ | ✓ | ✓ |
| F5 | F4 link target | `https://fosterrx.com/` | n/a | n/a | n/a |
| F6 | Trust anchor link label | `Signing key (PEM)` | ✓ | ✓ | ✓ |
| F7 | F6 link target | `/.well-known/angis-signing-key-v1.pub` | n/a | n/a | n/a |
| F8 | Fingerprint link label | `Signing key fingerprint` | ✓ | ✓ | ✓ |
| F9 | F8 link target | `/.well-known/angis-signing-key-v1.fingerprint` | n/a | n/a | n/a |

Notes:
- F1/F2/F3 match the exact attribution strings already used across the site and the synth repo
  footer convention. Reusing them keeps attribution consistent.
- F8/F9 expose the published fingerprint file so a technical user can independently confirm the
  cross-check input. The reconnaissance confirmed this file exists
  (`.well-known/angis-signing-key-v1.fingerprint` = `d7c581cc…2cd2e0`).
- **Methodology-documentation footer link (former F10/F11) dropped (Item 1)** — no published
  destination; same rationale as §6.

---

## 9. Manifest rendering — signed source & methodology provenance (Step 4c)

Rendered beneath a **valid** badge only, and never in any other state. Every string here
describes the *signed contents*; none of them describes the verification result, which remains
the badge's exclusive job (§4).

| ID | Context | Literal text | I-1 | I-5 | I-15 |
|----|---------|--------------|-----|-----|------|
| M1 | Intro line above the lists | `The sources and methodologies below are part of the signed certificate. They were covered by the signature check above.` | ✓ | ✓ | ✓ |
| M2 | Sources heading | `Sources` | ✓ | ✓ | ✓ |
| M3 | Methodologies heading | `Methodologies` | ✓ | ✓ | ✓ |
| M4 | Sources absent or empty | `This certificate does not itemize its sources.` | ✓ | ✓ | ✓ |
| M5 | Methodologies absent or empty | `This certificate does not itemize its methodologies.` | ✓ | ✓ | ✓ |
| M6 | Certificate kind carries no manifests | `This certificate type does not carry source or methodology manifests.` | ✓ | ✓ | ✓ |
| M7 | Contents could not be decoded/rendered | `The certificate's contents could not be displayed. This does not affect the signature result above.` | ✓ | ✓ | ✓ |
| M8 | Per-source date prefix | `Accessed` | ✓ | ✓ | ✓ |

Notes:
- **M7's second sentence is load-bearing and must not be edited away.** §4's governing rule is
  that we never show a verification failure we did not actually observe. A render fault is not a
  signature fault, so M7 states plainly that the badge above still stands. `renderManifests()` is
  called outside the try/catch that renders `invalid`, and does not raise, so a display fault
  cannot reach the badge — M7 is the prose half of that invariant.
- **M4/M5 vs M6 is an I-1 distinction, not a wording preference.** `canonical_form()` omits an
  empty manifest from the signed bytes (Phase 2.6 back-compat), so *absent* and *empty* are the
  same state to a reader and share M4/M5. A `synthetic_data` certificate is different in kind: it
  has no manifest fields at all, so "does not itemize its sources" would falsely imply an empty
  list where the concept does not apply. M6 says *not applicable* instead. Reporting three states
  with two strings would overclaim in one direction or the other.
- **M1 claims coverage, not correctness.** "Covered by the signature check" is true — the entries
  are inside the signed canonical. It deliberately stops short of any claim about the sources
  themselves; §6 (N1/N2) carries that limit.
- Per-entry values (source name, category, version, methodology name, version, description) are
  **rendered data, not authored prose** — the same treatment as C2. No governance claim attaches
  to their wording, which originates in the methodology registry and the source manifest. All
  registry descriptions are customer-safe and partner-name-free by construction (ADR-0028).
- `partnership_classification` renders **verbatim** (`INTERNAL` / `PARTNER_FORMALIZED` /
  `PARTNER_PENDING`) per the founder decision of 2026-08-01. Rationale in §10, item 7.
- `source_url` renders as **text, not a hyperlink**. It is unauthenticated third-party-supplied
  data on a public governance page and must not become a clickable target.
- All entries are built with `createElement` + `textContent`, never `innerHTML`.

---

## 10. Founder review — resolution status (all six items closed)

All six items flagged in the original Step 4a draft were resolved by the founder and applied in
this revision. **No open ⚠ flags remain.** Per-item disposition (full before/after in the
CHANGELOG):

1. **Methodology documentation links (former N4/N5/N6, F10/F11)** — **DROPPED.** No published
   destination; a placeholder would imply documentation that doesn't exist (I-1).
2. **Landing context link (former L8/L9)** — **DROPPED.** Landing page stands alone.
3. **N3 payload-binding nuance** — **FOLDED OUT.** Not user-relevant under Path Z (no payload
   displayed); re-enters with the 1.A manifest-rendering follow-up.
4. **B3/E6 tone** — **REVISED to investigative** ("does not verify… contact Foster Rx").
5. **W2 privacy claim** — **REVISED** to "No third party is involved, and no personal data is
   transmitted."
6. **W1 "issued by Foster Rx"** — **NO CHANGE** (approved as the intended interpretation).

**Step 4c founder decisions (2026-08-01), added to this lineage:**

7. **`partnership_classification` display** — **VERBATIM.** The alternatives (collapse
   `PARTNER_*` to a neutral "Partner", or omit the field) were considered and rejected: the
   signed canonical is published in full so that a browser can verify over it, which means the
   raw value is public regardless of what the page renders. Softening it would be presentational
   only, and discoverable by anyone who decodes the bytes — a gap between what is attested and
   what is displayed. Verbatim is the only option with no such gap. At the time of the decision
   all registered methodologies are `INTERNAL` (ADR-0028 registry, eight entries).
8. **`narrative_synthesis` gating** — a certificate carries a narrative **only** when a human
   review backs it (`build_certificate` withholds it otherwise). The rule is an equivalence:
   *narrative present ⟺ human-reviewed*. This is what permits customer-facing materials to
   describe a narrative-bearing certificate as reviewed without asserting anything false: a
   certificate without a narrative carries only machine-derived content (manifests, hashes,
   structural facts) and makes no claim requiring human judgement.

**Tone principle now applied document-wide (from Item 4):** honesty about *what is/ isn't
verified* (I-1) is distinct from *tone toward the holder*. I-1 forbids overclaiming what is
present; it does not require maximally pessimistic language about absent verification. A revision
pass against this principle found **no other strings needing change** — the remaining "Unable to
verify" explanations (B4/B5/B6 → E5/E9/E3/E4/E7/E8/E10) are already neutral-factual, and the not-
found/network/format errors guide the user without assigning blame. The only string exhibiting the
tension was B3/E6, now revised.

**No I-5 or I-15 issues found.** No prohibited patent terms and no partner/internal names appear in
any inventoried string. "ANGIS," "Foster Rx," and "Ed25519" are the only proper/technical nouns
used, and all three are permitted (product name, company name, public cryptographic standard).

---

## 11. Guardrails honored in this step
- No verify-page code, HTML, or JS written.
- `firebase.json`, `.firebaserc`, `.github/workflows/**`, `.claude/settings.local.json` untouched.
- Strings only; every customer-visible string inventoried and individually governance-flagged.

---

## 12. CHANGELOG

### Step 4c revision pass (2026-08-01) — manifest rendering

String count 46 → **55** (8 added as M1–M8, 1 restored as N3, 4 revised in wording: L4, L7, C2, N2).

| Item | Action | Before | After |
|------|--------|--------|-------|
| **7** | **ADD** M1–M8 | *(no manifest strings existed under Path Z)* | §9 — 8 strings covering the present / absent / not-applicable render states |
| **8** | **RESTORE** N3 | *(folded out in Step 4a: "re-enters with the 1.A follow-up")* | Honest-emptiness statement for absent and not-applicable manifests. The original payload-binding concern is answered structurally instead — the page renders from `canonical_form_b64`, so displayed contents are the signed bytes. |
| **9** | **REVISE** N2 | `This page verifies the certificate's signature only. It does not yet display the certificate's contents…` | `When a certificate's signature is valid, this page lists the sources and methodologies recorded in it…` |
| **10** | **REVISE** L4 | `FRXS-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` | `FRXS-XXXXXXXXXXXXXXXX` |
| **11** | **REVISE** L7 | `…followed by a 36-character identifier.` | `…followed by a string of letters and numbers. Paste the whole ID exactly as it appears…` |
| **12** | **REVISE** C2 example | `FRXS-1A2B3C4D-5E6F-4A8B-9C0D-1E2F3A4B5C6D` | `FRXS-1A2B3C4D5E6F4A8B` |
| **13** | **CORRECT** §2 signer note | *"the real `FRXS-` + UUID shape (41 chars total) confirmed from the signer (`core/certificate.py:383`)"* | Corrected: that line is the `default_factory`; production issues `FRXS-<16 hex>` from four call sites. The same inference produced a live defect in `CERT_ID_RE`. |
| **14** | **UPDATE** scope header | `Path Z — signature verification only, no manifest rendering` | `Path Z + Step 4c manifest rendering` |
| **15** | **RENUMBER** §9–§11 → §10–§12 | — | new §9 is manifest rendering |

**Governance note.** Items 10–13 all trace to one root cause: a format was inferred from a model
default rather than read from the code that issues certificates. The inference reached the
verifier regex, the placeholder, the guidance copy, the example, and this document's own note.
Nothing caught it until a real certificate ID was compared against the pattern. Recorded here
because the failure mode — inferring behaviour from a declaration instead of from production
call sites — is the one worth designing against, not the individual strings.

---

## Step 4a revision pass (founder-authorized)

Six founder decisions applied. String count 51 → **46** (5 visible strings removed; 3 link-target
rows removed; 2 unique strings revised in wording, touching 3 rows).

| Item | Action | Before | After |
|------|--------|--------|-------|
| **1** | **DROP** N4 (body) | `For details of the methodologies and sources behind a Foster Rx ANGIS certificate, see the Foster Rx methodology documentation.` | *(removed — no published methodology-doc destination; placeholder would breach I-1)* |
| **1** | **DROP** N5 (link label) | `Foster Rx methodology documentation` | *(removed)* |
| **1** | **DROP** N6 (link target row) | `(TBD — founder to confirm destination)` | *(removed)* |
| **1** | **DROP** F10 (footer link label) | `Methodology documentation` | *(removed)* |
| **1** | **DROP** F11 (link target row) | `(TBD — same destination question as N6)` | *(removed)* |
| **2** | **DROP** L8 (link label) | `Learn about Foster Rx ANGIS intelligence` | *(removed — landing stands alone; L7 ends cleanly)* |
| **2** | **DROP** L9 (link target row) | `https://fosterrx.com/#angis` | *(removed)* |
| **3** | **FOLD OUT** N3 (body) | `Because the certificate's contents are not displayed here, this page does not yet confirm that any displayed contents correspond to the signed data. That binding will be enforced when itemized provenance is added.` | *(removed as a standalone string — not user-relevant under Path Z; N2 already scopes the deferral. Binding disclaimer re-enters with 1.A manifest rendering.)* |
| **4** | **REVISE** B3 explanation | `This certificate's signature did not match Foster Rx's published signing key. It may have been altered, or it may not be a genuine Foster Rx certificate.` | `This certificate's signature does not verify against Foster Rx's published key. If you obtained this certificate through official channels, contact Foster Rx — there may be an issue with the certificate or the verification process.` |
| **4** | **REVISE** E6 body | *(mirrored B3 — old wording)* | *(mirrored B3 — new investigative wording)* |
| **5** | **REVISE** W2 (3rd sentence) | `Nothing about this certificate is sent anywhere as part of verification.` | `No third party is involved, and no personal data is transmitted.` |
| **6** | **NO CHANGE** W1 | `…confirms the certificate was issued by Foster Rx and has not been altered since it was signed.` | *(unchanged — approved)* |

**Additional housekeeping (consequential to the above):**
- §2 note: replaced L8/L9 destination question with a "dropped" note.
- §4 note: B3 ⚠ note replaced with the investigative-tone rationale + statement that the tone
  principle is now applied document-wide.
- §5 note: W2 ⚠ nuance note replaced with the applied-revision rationale.
- §6 notes: added "folded out" (N3) and "links dropped" (N4/N5/N6) notes.
- §7: E1 cross-reference updated `L1–L8` → `L1–L7`.
- §8 note: F10/F11 "open question" note replaced with "dropped".
- §9: converted from "open questions" to "resolution status (all six closed)."
- Header: status line updated; inventory summary table added; legend ⚠ reference removed (no
  open flags remain).

*Built by Foster Rx Systems Inc. — Patent Pending No. 19/459,855*
