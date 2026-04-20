# Foster-Rx-domain
<img src="https://fosterrx.com/assets/logo.png" alt="Foster Rx" width="80" />

Production website for fosterrx.com  
**The decision intelligence layer for clinical trial execution.**

---

## Overview

This repository contains the complete source for the Foster Rx marketing and company website. It is a single-file static site deployed via Firebase Hosting to a custom domain. There are no build tools, frameworks, or dependencies — the entire site ships as one self-contained HTML file.

---

## Deployment

This site auto-deploys to Firebase Hosting (`fosterrx-prod` project)
on push to `main` via the GitHub Action in
`.github/workflows/firebase-deploy.yml`.

The custom domain `fosterrx.com` is bound to the Firebase site in the
Firebase console; DNS records (A/AAAA) point at Firebase Hosting IPs.

### Manual deployment

If the GitHub Action fails or you need to deploy locally:

```bash
firebase deploy --only hosting --project fosterrx-prod
```

This requires the Firebase CLI installed and authenticated against
the `fosterrx-prod` project.

### `.well-known/` assets

`.well-known/angis-signing-key-v1.pub` and
`.well-known/angis-signing-key-v1.fingerprint` are the published
ANGIS ed25519 public key and its SHA-256 fingerprint. Firebase
Hosting is configured (`firebase.json` → `headers`) to serve these
with `Content-Type: application/x-pem-file`,
`Cache-Control: public, max-age=3600`, and
`Access-Control-Allow-Origin: *` so any client can fetch and verify
ANGIS intelligence report certificates.

---

## Repository Structure

```
foster-rx-domain/
├── index.html              ← Production site (deploy from repo root)
├── og-image.html           ← Source file for generating the OG/social preview image
├── firebase.json           ← Firebase Hosting config (site, ignore rules, headers)
├── .firebaserc             ← Firebase project binding (fosterrx-prod)
├── README.md               ← This file
├── LICENSE                 ← Proprietary license
├── .github/
│   └── workflows/
│       └── firebase-deploy.yml  ← Auto-deploy on push to main (WIF-based)
├── .well-known/
│   ├── angis-signing-key-v1.pub          ← ANGIS ed25519 public key (PEM)
│   └── angis-signing-key-v1.fingerprint  ← SHA-256 of the DER pubkey
└── assets/
    ├── logo.png            ← Foster Rx brand logo (nav + footer)
    ├── gabrielle-foster.jpg← Founder photo (team section)
    ├── team-logos.png      ← Composite affiliation strip (MIT, Hopkins, Takeda, etc.)
    └── og-image.png        ← Social preview image for LinkedIn/Slack/iMessage (1200×630px)
```

> Note: `og-image.png` must be generated manually from `og-image.html`. See [Generating the OG Image](#generating-the-og-image) below.

---

## Site Architecture

The site is a single-file static HTML application. All CSS and JavaScript are inlined in `index.html`. There is no build step, no bundler, no server-side code.

### Fonts

Loaded from Google Fonts at runtime:

- **Cormorant Garamond** — headings and serif display text
- **DM Mono** — labels, badges, monospaced UI elements
- **DM Sans** — body copy

### Sections (in order)

| ID | Description |
|----|-------------|
| `#hero` | Full-viewport headline with CTA buttons |
| `#problem` | Stat cards (28% / 90% / $2.1M) + root cause analysis |
| `#solution` | Four feature cards explaining the platform |
| `#offerings` | Three offering cards (Core Platform / Data / Discovery) |
| `#traction` | Patent, KOL count, orphan assets chips |
| `#team` | Founder card with photo, bio, affil logos, badges |
| `#cta` | Full-width call to action |
| `footer` | 4-column grid: brand, platform, company, contact |

---

## Email Obfuscation

All `mailto:` links are assembled at runtime via JavaScript to avoid exposure to static scrapers. Do not hardcode email addresses directly in HTML attributes.

```js
var u = 'info', d = 'fosterrx', t = 'com';
var email = u + '@' + d + '.' + t;
```

---

## Key Assets

**`assets/logo.png`**  
Brand logo — used in the nav bar and footer. Should be a transparent PNG, ideally 2× resolution. Displays at 36px height in nav, 30px in footer.

**`assets/gabrielle-foster.jpg`**  
Founder portrait. Displays at 120×120px circular crop. Falls back to a "GF" monogram placeholder if missing.

**`assets/team-logos.png`**  
Composite strip of affiliation logos. Rendered with `mix-blend-mode: screen` against the dark card background.

**`assets/og-image.png`**  
Social preview image for LinkedIn, Slack, iMessage, WhatsApp, and X. Must be exactly 1200×630px.

---

## Generating the OG Image

`og-image.html` is a standalone 1200×630px HTML file that renders the social preview card.

To export as PNG:

1. Open `og-image.html` in Chrome
2. Set browser zoom to **100%** (critical for correct dimensions)
3. Open DevTools → `Cmd+Shift+P` → type **"Capture full size screenshot"**
4. Save as `og-image.png`
5. Move to `assets/og-image.png` in this repo

---

## SEO & Meta Tags

`index.html` includes a full meta tag block in `<head>`:

- `<title>` — browser tab and search result title
- `<meta name="description">` — search snippet
- `<meta name="keywords">` — secondary keyword signal
- OpenGraph (`og:*`) — LinkedIn, Slack, iMessage previews
- Twitter Card (`twitter:*`) — X link previews
- `<link rel="canonical">` — prevents duplicate indexing

> Do not change the `og:image` path without also updating `assets/og-image.png`.

---

## Analytics

Google Analytics 4 (GA4) can be added by inserting the following snippet into `<head>` in `index.html`, replacing `G-XXXXXXXXXX` with the actual Measurement ID:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

The Measurement ID is found in **Google Analytics → Admin → Data Streams → Web → your stream**.

---

## Key Links

| Resource | URL |
|----------|-----|
| Live site | [fosterrx.com](https://fosterrx.com) |
| Book a meeting | [Outlook Bookings](https://outlook.office.com/bookwithme/user/fd4f04c623d94128b78993cd23fbead9@fosterrx.com/meetingtype/_0FJELVYr0OZK8BTji-Kzg2) |
| Company LinkedIn | [linkedin.com/company/foster-rx-llc](https://linkedin.com/company/foster-rx-llc) |
| Patent | No. 19/459,855 (pending) |
| Contact | info@fosterrx.com |

---

## Contributing / Editing

This is a single-person repository. All edits go directly to `main` and deploy immediately via GitHub Pages.

When editing `index.html`:

- Test locally by opening in a browser before pushing
- All CSS is in the `<style>` block in `<head>` — color tokens are in `:root`
- All JavaScript is in `<script>` blocks at the bottom of `<body>`
- Do not introduce external JS dependencies without reviewing load-order implications
- Preserve the email obfuscation pattern — do not hardcode `info@fosterrx.com` in HTML

### Color Tokens (CSS variables)

```css
--ink:     #0e1c18   /* page background */
--deep:    #132119   /* section background */
--surface: #1a2e2a   /* card background */
--teal:    #4a8a7d   /* primary accent */
--teal-lt: #6aaa9d   /* lighter accent, hover states */
--cream:   #f0ebe0   /* primary text */
--sand:    #d8d1c2   /* secondary text */
```

---

## License

Proprietary. All rights reserved. © Foster Rx LLC.  
