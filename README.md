# itziar.dev

Personal portfolio and blog of Itziar Morales Rodríguez — Software Engineering student at U-tad (Madrid), minor in Data Science & AI.

Built with [Astro](https://astro.build), deployed on Cloudflare Pages.

## Pages

- `/` — Home with featured projects
- `/about` — Background, stack overview, and contact
- `/projects` — Full project grid
- `/stack` — Self-rated skills by category

## Tech

- **Framework:** Astro 6
- **Styling:** Plain CSS with CSS variables (no Tailwind in use)
- **Icons:** astro-icon + Simple Icons + Lucide
- **Fonts:** JetBrains Mono
- **Deployment:** Cloudflare Pages
- **CV PDFs:** `public/itziar-morales-cv*.pdf` are built and pushed by the `cv` repo's CI. Those sync commits must not contain `[skip ci]`, or Cloudflare Pages skips the deploy and the site keeps the old PDF.

## Local dev

```bash
npm install
npm run dev
```

## Licence

Code is MIT. Content (writing, CV) is all rights reserved.
