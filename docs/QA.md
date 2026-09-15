# NIPO redesign verification

## Deployment, SEO and consent review — 15 September 2026

- Updated Astro 6 to 7.3.2 and patched image/build/test dependencies. Full `pnpm audit --audit-level low` reports **no known vulnerabilities**. Frozen-lockfile installation passed.
- Corrected the pre-existing Astro config callback, which Astro did not evaluate. Verified both an actual Netlify deploy-preview build (noindex HTML and headers, empty sitemap) and production build (indexable HTML and complete sitemap). Final `dist` contains the production build.
- Build/typecheck: 0 errors, warnings or hints. Every build now validates generated metadata, canonical URLs, deployment indexing policy, schema, FAQ/menu parity, links/anchors, social image and PDF signatures: **6 pages, 281 local links/assets, 68 menu items**.
- Backend tests: **13 passed**, including Netlify signup validation, successful mocked delivery, wrong challenge hostname, missing configuration and Brevo network failure. Deployment-config tests: **3 passed**.
- Browser regressions: **15 passed** covering mobile navigation/focus, gallery/lightbox/swipe, menu preview and PDFs, slideshow, reduced motion, mocked VIP success/validation/server/network errors, image failure and no-JavaScript fallback.
- Consent browser checks: **8 passed** covering no Google requests before consent, rejection persistence, keyboard-accessible settings, analytics-only consent with advertising denied, withdrawal/cookie removal, accept-all persistence, malformed storage and expired consent. Google requests were intercepted in these tests.
- Responsive image checks: **35 passed** across Home, Concept, Menus, Gallery and Contact at widths from 360 to 3440 pixels, with no horizontal overflow or image containment failures.
- Visually inspected the mobile and desktop cookie banners. Accept all and Reject optional have equal treatment; preferences offer separate purposes. Screenshots and reports are in ignored `tmp/qa/`.
- Local HTTP checks: robots.txt and sitemap return 200, menu PDF returns 200/application/pdf, a nonexistent page returns the custom 404 with status 404.
- Live baseline checks: apex serves from Netlify, www returns 301 to the apex, invalid empty signup returns expected 400 field errors. No mailing-list contact was created. Private Netlify settings were not accessible because the connector requires reauthentication; real challenge and Brevo delivery remain launch checks.
- Published GTM container had no destination tags. Consent wiring is complete; GA4 measurement ID/destination configuration remains outstanding. No deployment or GTM publishing was performed.
- Confirmed business details were applied to content and schema. The owner requested no change to the nigiri entry despite the VG/tamago ambiguity.
- Browser tests must run after builds, because builds replace `dist`. Early automation failures caused by rebuilding during navigation and by clicking an offscreen footer control were corrected in the test procedure; the completed runs above used stable builds and keyboard activation.

Launch instructions, sources and remaining account-side checks: [DEPLOYMENT.md](DEPLOYMENT.md).

## Concept card imagery and gallery control — 15 September 2026

- The owner rejected the generated shared-table concept image. Restored the approved tartare close-up and deleted the rejected image and its saved copies.
- After restoration, `pnpm build` passed with 0 errors, warnings and hints. Verified the served Home HTML uses tartare for the concept card, contains no rejected-image reference or Pause gallery button, and the generated master, workspace copies and optimized assets are deleted.
- Removed the Pause gallery button and its JavaScript listener/state and CSS. Automatic movement, hover/focus pausing, dragging and reduced-motion behaviour remain.
- Before reverting the image, `pnpm build` passed with 0 errors, warnings and hints; `git diff --check` passed. Checked the card at 390, 1024 and 1440 pixels, with no horizontal overflow and the removed control absent. Screenshots of the rejected image were deleted with it.
- Browser checks passed for gallery movement, hover pausing, dragging and reduced-motion inactivity. Lightbox opening via Enter and clicking a focused rail image, and Escape closing, were verified. The first automated click on an offscreen original moved the rail on focus; rechecked after bringing the target into focus. No browser errors reported. Local preview only.

## Menu-aligned concept copy — 15 September 2026

- Home and Concept now share the supplied menu's “Two cultures. One table.” message. Concept includes verified migration history, Brazil's Japanese-descendant community, practical dining guidance and the purpose behind the shared table. Source notes are in `docs/CONCEPT-COPY.md`.
- Removed the public Gallery AI imagery note at the owner's request. Its introduction now uses the same maximum width and left edge as the image grid; internal provenance remains in `docs/IMAGERY.md`.
- `pnpm build` passed with 0 errors, warnings and hints. `git diff --check` passed.
- Browser checks passed for Home, Concept and Gallery at 390, 1440 and 2560 pixels: no horizontal overflow, one H1, all photo elements decoded, expected copy present and gallery heading/grid alignment within 1 pixel. No browser errors were reported.
- Visually inspected desktop Concept and Gallery and mobile Concept. Evidence: `tmp/qa/copy-*.png` and `tmp/qa/copy-layout.json`. Changes are in the local preview; no production deployment was performed.

## Approved food imagery integration — 15 September 2026

- All eight active photos now use the approved food-reference masters. Their SHA-256 hashes match the reviewed collection; old placeholder files remain archived but are absent from the five main built pages' image references.
- Updated image IDs, alt text, captions, hero/menu selections, gallery origin note and the 1200×630 social card. Kept native source resolution for responsive assets and capped lightbox output at the source width.
- `pnpm generate:assets` and `pnpm build` passed; Astro reported 0 errors, warnings and hints and generated 60 optimized image assets.
- `scripts/verify-image-layout.mjs`: all 35 page/viewport checks passed, from 360×800 through 3440×1440. On Windows, start the `nipo-layout` browser session before the script to avoid the daemon inheriting stdout during its first launch.
- `scripts/verify-browser.mjs`: all 15 browser scenarios passed against the local mock fixture, including revised photo IDs and captions in the lightbox, menu photography and all hero slides.
- All eight gallery photographs decoded successfully in Chromium. Visually checked the complete desktop gallery, all three mobile hero images, desktop Home, Concept and Contact; no uncaught page errors were reported. Mobile hero crops retain recognisable subjects and readable copy.
- Evidence: `tmp/qa/approved-*.png`, `tmp/qa/image-containment.json`, and the browser regression output. Production deployment was not performed.

Verified 14 September 2026 against the supplied Amazónico Home and menu reference screenshots and NIPO brand guide.

## Build and existing backend

- `pnpm check`: 0 errors, 0 warnings, 0 hints.
- `pnpm build`: successful static build; seven HTML routes and responsive AVIF/WebP assets generated.
- `pnpm test`: all eight existing Worker tests pass. Worker and Netlify backend source is unchanged.
- `git diff --check`: clean.

## Layouts and content

Home, Concept, Menus, Gallery, Contact, Privacy and 404 inspected at 1440×900, 1024×768, 390×844 and 360×800. All 28 route/viewport checks reported no horizontal overflow, one H1, a title, description and canonical URL, with no framework error overlay. Full-page compositions were inspected for the five main pages. Images were also decoded after scrolling to verify the entire collection loads.

- Concept is 404 words in the rendered main content.
- Sample food contains eight agreed dishes, its subject-to-change notice, no prices and no internal markers.
- All local image, script, PDF and page links in the production HTML resolve to build artifacts.
- All six indexable routes are in the sitemap. The 404 page is noindex.
- Contact's visible FAQ questions and answers match its JSON-LD.
- Opening date is centralised as 23 September 2026.
- Base contrast: ivory/night 14.39:1; gold/night 12.24:1; muted copy/night 8.72:1; error text/ivory 6.90:1. Photograph overlays were visually inspected.

## Interactions

All 15 browser regression scenarios passed against the final production build.

The reproducible local browser script is `scripts/verify-browser.mjs`, using the production files via `scripts/qa-server.mjs`. It covers mobile navigation/focus, menu previews and HTML/PDF destinations, lightbox arrows/keyboard/swipe/focus restoration, seven-second slideshow timing, pause/manual controls, offscreen pause, draggable rail, reduced motion, signup validation/success/server error/network error, image failure, and navigation without page scripts.

Browser-tab visibility was separately checked with a second tab: switching away recorded `hidden:true, paused:true`; returning recorded `hidden:false, paused:false`. No reservation or live mailing-list contact was created.

The QA server removes the external Turnstile script and accepts only the test token for mock signup success. Real Turnstile verification remains covered by the existing backend tests. The script-free case uses a CSP that disables all page scripts; the fallback navigation, static hero, food anchor and gallery file links remain usable.

## PDF verification

All 20 PDF pages rendered and inspected. Drinks has 12 pages; Wine has eight. Printer marks are outside the new page boundaries. Each website MediaBox matches the original TrimBox. Content streams match their respective original pages byte for byte. The original supplied PDF files were not changed.

## Evidence and limits

### Desktop image containment regression

The reported Contact overlap was reproduced at 2560×1440: the image extended about 246px below its section. Shared picture content is now positioned inside its frame, and editorial grid frames stretch to the row instead of inheriting the image's intrinsic height. Contact and Concept use a consistent bounded minimum height without conflicting maximum-height constraints.

`scripts/verify-image-layout.mjs` checks all five main pages at 360×800, 390×844, 1024×768, 1440×900, 1920×1080, 2560×1440 and 3440×1440. It asserts noncollapsed frames, images inside their frames, editorial frames inside their sections and no horizontal overflow. Run it against the production preview with `AGENT_BROWSER_BIN` configured. Results are saved to `tmp/qa/image-containment.json`.

Local screenshots, viewport results, PDF renders and browser results are in ignored `tmp/qa/`. This is Chromium browser verification with desktop/mobile viewport sizes and synthetic pointer swipe checks; physical iOS/Safari testing was not performed. The original SevenRooms destination was preserved; no live reservation was submitted. Production deployment was not performed.

The ordinary production preview on port 4322 serves the static website. The mock server on port 4323 is a test fixture only; the real VIP service still requires the existing Worker/Netlify secrets and approved Turnstile hostname configuration.
