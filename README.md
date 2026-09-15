# NIPO website

An Astro 7 restaurant website for NIPO on Newcastle Quayside: Home, Concept, Menus, Gallery, Contact and Privacy. GSAP provides the hero slideshow, draggable gallery rail and menu previews. Netlify is the production host; the Cloudflare Worker is retained as an alternative.

## Local preview

```sh
pnpm install
pnpm dev
```

For the production build:

```sh
pnpm test
pnpm check
pnpm build
pnpm preview --host 127.0.0.1 --port 4322
```

The frontend preview does not run the VIP backend. For a complete local signup flow, supply the existing secrets from `.dev.vars.example` and run Wrangler on port 8787 alongside Astro; Astro proxies `/api/*` to that port. Netlify also retains its existing `/api/vip-signup` function.

## Content and assets

- `src/config/site.ts`: navigation, booking URL, address, socials, opening status/date, slideshow and future video.
- `src/data/media.ts`: photo imports, descriptions, captions and desktop/mobile focal positions.
- `src/data/menus.ts`: menu destinations and 68 sample food dishes.
- `src/config/seo.ts`: page registry, linked Restaurant/page/menu schema and visible Contact FAQs.
- `src/scripts/consent.ts`: optional cookie choices and consent-gated GTM loading.
- `src/assets/photos/approved/`: eight approved food-reference PNG masters used across the website. Earlier placeholders are retained in the parent folder; prompts and source mappings are in `output/imagegen/nipo-food-v1/`.
- `public/menus/`: approved Drinks and Wine website PDFs, cropped to their original trim boxes.
- `docs/IMAGERY.md`: asset catalogue and photoshoot replacement instructions.
- `docs/IMPLEMENTATION.md`: menu, opening, video and signup maintenance.
- `docs/QA.md`: verification evidence and limits.

Run `pnpm generate:assets` after changing the social-card photograph. Astro builds responsive AVIF and WebP automatically.

## Browser regression checks

Install `agent-browser` and set `AGENT_BROWSER_BIN` to its executable. After `pnpm build`, run `node scripts/qa-server.mjs` in a separate terminal, then `node scripts/verify-browser.mjs`. The fixture on port 4323 serves the production files with local VIP responses and removes the external Turnstile script. It never creates real mailing-list contacts. `QA_ORIGIN` accepts localhost URLs only. Results and screenshots go to ignored `tmp/qa/`. The user-facing production preview remains on port 4322.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Netlify configuration, verification and launch checks. `pnpm build` checks TypeScript, builds the site, and validates generated SEO, schema, links and social assets. Netlify also runs the backend tests before building. Node 22.12 or later is required.

For consent verification, run `node scripts/verify-consent.mjs` against the production preview on port 4322. It intercepts Google requests and does not send analytics events. Run browser checks only after a build has completed; rebuilding replaces `dist` while tests are running.
