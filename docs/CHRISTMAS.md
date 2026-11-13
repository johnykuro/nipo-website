# Christmas dining

The shared seasonal page is `/christmas/`, for Newcastle Quayside and Harrogate. Regular dining tables, couples, friends and families lead the copy. A dedicated office-party and larger-group CTA immediately follows the menu, with venue-specific enquiry emails. The primary action is “Book your Christmas table”, leading to venue-specific contacts and Newcastle online booking.

## Established design

This page extends the existing NIPO system: dark green, ivory, gold, Playfair headings, existing buttons and text links, generous spacing and food-led editorial composition. The sequence is festive steak hero, inclusive dining introduction with the existing wine portrait, full festive menu, office-party CTA, then general venue contacts. Desktop hero copy overlays the photograph; below 768px it sits above the photograph. Seasonal snowfall spans the viewport throughout the Christmas page, including the menu and footer. Difference blending keeps particles visible over light and dark sections. A fixed transparent ghost button pauses or resumes the effect. Its text stays ivory with a dark shadow over photography and dark surfaces, switching to dark green over the ivory menu; button text does not use difference blending.

`PRODUCT.md`, `DESIGN.md` and design sidecars remain unchanged. Their previously reported context drift was outside this campaign's repair scope; this document records the extension without replacing their brand authority.

## Maintenance inputs

- `src/pages/christmas.astro`: page copy, course prices, composition and scoped styles. Preserve inclusive dining above the menu and the dedicated group-party invitation immediately below it.
- `src/data/festive-menu.ts`: the 15 dishes in source order, dietary markers, four festive exclusives and printed notes. Course combinations and service dates were not supplied; do not infer them.
- `public/menus/nipo-festive.pdf`: byte-identical copy of the supplied `NIPO-festive-set-menu-WEB.pdf`. SHA-256: `747EA0329CC4E82C06ED7F32686153A541E1E64EEB794546E65A8B18195A3FC1`.
- `src/config/christmas.ts`: campaign contacts and encoded email enquiry template. Newcastle reuses its ordinary location email, phone and booking URL. Harrogate uses `harrogate@nipobraza.co.uk` for festive enquiries, with no invented phone or booking link. This does not change Harrogate's general opening or reservation status.
- `src/data/media.ts`: existing `christmas-steak` and `christmas-wine` image records. Preserve approved assets and their focal positions.
- `src/data/menus.ts`: festive menu selection link and price-only description, “3 courses £55 · 4 courses £65”. Update this alongside the page if approved prices change.
- `src/config/site.ts` and `src/config/seo.ts`: navigation entry and page registration.

## Scoped interface extensions

`FoodMenu` accepts optional `locationLabel` and `closingAction` properties; existing callers retain Newcastle defaults. Menu dishes accept the optional `festiveExclusive` marker. The Christmas page supplies its shared location label and enquiry anchor, preserving the existing menu presentation and allergen footer. The ivory menu PDF link uses a dark teal hover treatment; festive dish descriptions are 16px on mobile.

`src/scripts/christmas-snow.ts` controls decorative snowfall with a keyboard-accessible pause/resume button. Motion continues while scrolling and pauses when the document is hidden or the page is inactive. Reduced-motion preference hides both snow and its control, including when that preference changes. Without JavaScript both remain hidden and all essential content and links are available. There are 32 decorative particles on desktop and 14 visible on mobile; the effect does not intercept pointers. `christmasEnquiryHref` accepts an optional `party` occasion for the group CTA; ordinary festive-dining emails remain the default.

No dependencies, backend service or deployment were added for this campaign.

## Local preview and verification

Build before starting the fixture, and keep `dist` stable while browser checks run:

```powershell
pnpm test
pnpm build
node scripts/qa-server.mjs
```

The fixture serves the page at `http://127.0.0.1:4323/christmas/`. In a second terminal, use an already installed Playwright module:

```powershell
node scripts/verify-christmas-browser.mjs
```

If Playwright is available outside the repository, set its absolute module path first. The browser channel defaults to installed Chrome and can be overridden:

```powershell
$env:PLAYWRIGHT_MODULE_PATH = 'C:/absolute/path/to/playwright'
$env:PLAYWRIGHT_CHANNEL = 'chrome'
node scripts/verify-christmas-browser.mjs
```

`QA_ORIGIN` optionally selects another localhost HTTP origin and port. Reports and screenshots are written to ignored `tmp/qa/christmas/`. The fixture is for local verification only.

Earlier baseline verification on 13 November 2026: 53 tests passed; production build reported zero errors or warnings; SEO checks covered 15 pages, 1,138 local links/assets and 334 menu items. All 13 original Christmas browser checks passed, including hero-only offscreen snowfall pausing. The targeted design review returned **ship** for that baseline, with both contrast/readability findings resolved.

Latest revision on the same date: full-page snowfall replaces the hero-only behaviour, and a dedicated office-party CTA follows the menu. A fresh build reported zero errors or warnings with the same SEO totals. All **14** browser checks passed, with no browser errors recorded in `tmp/qa/christmas/results.json`. They cover 320–1440px layouts including the 1199/1200px navigation boundary, menu/schema/PDF/contact checks, snow and its transparent control over the menu, group CTA and footer, both group enquiry links, hidden-page lifecycle, reduced motion, no JavaScript and Harrogate's ordinary operations. The targeted review returned ship after the ghost-control contrast issue was resolved and visually rechecked over both photographs, the ivory menu and the dark party section. These are local checks; no production deployment was performed.
