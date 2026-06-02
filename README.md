# Kazana Travel

A premium luxury travel website for Kazana Travel — a private-tour design company based in Almaty, Kazakhstan. Bilingual (English + Arabic with full RTL support), mobile-first, SEO-optimized.

**Live contact:** +7 771 316 0021 · kazanatravel@gmail.com · 113 Mukanov Street, Almaty

## Running locally

```bash
node server.js
```
Then open <http://127.0.0.1:8000/>. The server is a tiny Node static-file server with no dependencies — just Node ≥ 14.

## Deploying

### GitHub Pages
1. In the repo's **Settings → Pages**, set source to **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
2. Pages will serve `index.html` automatically. The static-file server (`server.js`) is not used in production.

### Any static host
The site is pure HTML / CSS / JS / images. Drop the repo's contents into Netlify, Vercel, Cloudflare Pages, or any S3-style bucket.

## Structure

```
index.html               — landing page
tours/                   — 6 tour detail pages
css/style.css            — design system
js/main.js               — interactivity (i18n, lightbox, carousel, animations)
js/i18n.js               — EN + AR translations
assets/images/           — photography
server.js                — optional local dev server
```

## Editing content

- **Copy / translations:** `js/i18n.js` (one object per language).
- **Tours, packages, prices:** edit the package cards inside `index.html` and the individual files under `tours/`.
- **WhatsApp number:** search for `77713160021` across the repo to update.
- **Photos:** drop replacements into `assets/images/` keeping the existing filenames.
