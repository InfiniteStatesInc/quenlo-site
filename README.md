# Quenlo — Marketing Site

The marketing website for **Quenlo** (quenlo.ai) — the organizational memory system for teams that live in Google Meet + Slack. Built by Infinite-State.

Live: **https://quenlo.ai**

## Stack
- Vite + React + TypeScript
- framer-motion (scroll story / animations)
- Deployed on Vercel (aliased to quenlo.ai)

## Develop
```bash
npm install
npm run dev      # local dev
npm run build    # production build -> dist/
npm run preview  # serve the build
```

## Structure
- `src/` — app source (pages, components, styles)
- `public/` — static assets shipped as-is (logos, hero demo video, mockups)
- `api/book-demo.js` — Vercel serverless function that writes "Book a demo" form submissions to a Feishu Bitable
- `brand-assets/` — brand kit: logo lockups, app icons, social banners, and `品牌规范.md` (brand spec)

## Brand
- Logo: the gradient magnifying-glass **Q** (`brand-assets/logo/quenlo-logo-on-light.svg` / `-on-dark.svg`)
- Fonts: **Space Grotesk** (headings), **Sora** (brand wordmark), **Inter** (body)
- Palette and full spec in `brand-assets/品牌规范.md`

## Environment variables (for `api/book-demo`)
Set these in Vercel (never commit secrets):
- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_BITABLE_APP_TOKEN`
- `FEISHU_BITABLE_TABLE_ID`
