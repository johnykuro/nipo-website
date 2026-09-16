# NIPO deployment readiness — 15 September 2026

## Destination and configuration

Production: **Netlify**, primary domain **https://nipobraza.co.uk**. The linked GitHub repository deploys automatically when changes are pushed to `main`. Publish this release through GitHub; the local Netlify project link is retained for diagnostics.

Netlify builds with `pnpm test && pnpm build`, publishes `dist`, and bundles `netlify/functions` with esbuild. Node 22 (minimum 22.12.0) and pnpm 10.13.1 are configured. The www hostname redirects permanently to the apex, preserving paths.

The normal release path is a tested commit pushed to GitHub `main`, followed by verification of Netlify's production deploy. `pnpm deploy` is a separate manual Netlify publishing command. The previous Cloudflare deployment is available explicitly as `pnpm cf:deploy`.

The existing Astro configuration used a Vite-style callback, which Astro did not evaluate. It now exports a supported configuration object. Canonical origin, trailing slashes, local API proxy and preview headers are actually applied.

| Setting | Value / purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | `https://nipobraza.co.uk` at build time, including preview builds |
| `PUBLIC_NOINDEX` | `false` in production; `true` for manually built previews |
| `PUBLIC_TURNSTILE_SITE_KEY` | Existing public key; its allowed hostnames must include the primary domain |
| `PUBLIC_PRIVACY_EMAIL` | `info@nipobraza.co.uk` (also the code default) |
| `SITE_ORIGIN` | `https://nipobraza.co.uk`, without a trailing slash; Netlify function runtime |
| `BREVO_LIST_ID` | Actual positive mailing-list ID; function runtime |
| `BREVO_API_KEY`, `TURNSTILE_SECRET` | Existing secrets, retained in Netlify; never commit them |

Netlify `deploy-preview`, `branch-deploy`, `preview-server` and `dev` contexts automatically produce noindex HTML and an `X-Robots-Tag` header covering static assets and PDFs. Preview sitemaps are empty and robots.txt does not advertise a sitemap. Preview pages remain crawlable so engines can read noindex. Canonicals still identify production. A manual CLI preview must be built with `PUBLIC_NOINDEX=true`; rebuild for production before publishing.

The optional Cloudflare configuration remains, but is not the selected launch path. Its placeholder runtime variables must be replaced before any future Cloudflare deployment. For Cloudflare Pages branch previews, set `PRODUCTION_BRANCH` to the actual production branch. Workers previews need explicit `PUBLIC_NOINDEX=true` builds.

## SEO and answer-engine setup

- Six public canonical pages in `/sitemap.xml`; no 404, API or duplicate URLs.
- `/robots.txt` permits search and AI crawlers, excludes `/api/`, and advertises the production sitemap.
- Unique titles/descriptions, canonical URLs, Open Graph and Twitter cards; verified 1200 × 630 social image.
- Linked WebSite, Restaurant and page entities with stable IDs; AboutPage, ContactPage, FAQPage, CollectionPage and BreadcrumbList where appropriate.
- Restaurant address, booking URL, social profiles, phone, email and confirmed hours from 23 September 2026: Monday–Thursday noon–9pm, Friday–Saturday noon–10pm, Sunday noon–8pm.
- Menu/MenuSection/MenuItem schema matches the confirmed main and dessert menus, with GBP Offer prices matching the visible dishes. No invented ratings, coordinates or dietary guarantees.
- Visible FAQs answer cuisine, location, opening date, reservations, hours and contact questions. Static HTML exposes this information without requiring JavaScript.
- Custom 404 is noindex and has no misleading canonical or Restaurant schema.
- Hashed Astro assets receive immutable caching; replaceable images and menu PDFs have shorter caches.

Google's [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) calls for ordinary crawlability, useful text and matching structured data; no special AI text file is required. Schema is not a promise of search enhancements or AI citations. See also [local business guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Cookie consent and analytics

The site now owns the consent UI. Accept all and Reject optional have equal visual treatment; Manage choices offers separate analytics and marketing switches. Choices persist locally for 180 days and can be changed from the footer. Malformed, expired or unavailable storage does not grant permission. The unconditional GTM script and noscript iframe are removed.

GTM loads only after at least one optional purpose is accepted. Default denied and purpose-specific consent updates are queued before GTM starts. Withdrawing permission removes known first-party cookies for that purpose and reloads to unload running tags. No optional scripts load without JavaScript. The privacy page describes this behaviour.

The published **GTM-542R3BH8** container was inspected during the review and had no tags. Consent wiring is ready, but analytics/advertising reporting needs real destination tags. The GA4 measurement ID has been requested. Do not add another unconditional GTM snippet.

When adding tags in GTM, use built-in Google consent checks and configure additional consent requirements for third-party/custom tags. Analytics tags must require `analytics_storage`; advertising tags must honour `ad_storage`, `ad_user_data` and `ad_personalization`. A consent to analytics alone must never trigger marketing. Update the privacy/cookie inventory and the CSP for actual providers, then verify in Tag Assistant. Consent version in `src/scripts/consent.ts` can be incremented when purposes change.

See Google's [basic consent mode guidance](https://developers.google.com/tag-platform/security/concepts/consent-mode) and the ICO's [cookie control findings](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/12/ico-action-secures-increased-cookie-compliance/).

## Verification commands

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm audit --audit-level low
```

Every build checks generated HTML for metadata, canonical/indexing consistency with deployment context, JSON-LD validity, visible FAQ/menu parity, local links and anchors, image alternatives, sitemap coverage, robots.txt, social-card dimensions and PDF signatures.

With `AGENT_BROWSER_BIN` set to the installed browser executable:

```sh
# Production preview on port 4322, built before starting tests:
node scripts/verify-consent.mjs
# Separate local fixture on port 4323 (mock VIP responses):
node scripts/qa-server.mjs
node scripts/verify-browser.mjs
node scripts/verify-image-layout.mjs
```

Browser evidence goes to ignored `tmp/qa/`. Consent tests intercept Google requests. Signup tests use mocks and do not create mailing-list contacts.

## Host-side checks and launch

- The Netlify connector needs reauthentication; private project settings and secret values were not inspected or changed.
- Read-only HTTP checks confirmed the current apex serves from Netlify and www redirects to it. An empty invalid signup submission returned field-validation errors (400), indicating required runtime configuration is present, without creating a contact. This does not prove real Turnstile or Brevo delivery.
- Before launch, use a Netlify preview to check response headers, the real 404 response, PDFs, booking destination and successful signup with a consenting test subscriber. Delete/unsubscribe that test contact afterwards as appropriate.
- After publishing, confirm production has no `noindex`, run [Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/), verify the domain in Search Console and Bing Webmaster Tools, and submit `https://nipobraza.co.uk/sitemap.xml`. Keep Google Business Profile hours, address, contact and menu URL aligned.
- On 23 September, change `siteConfig.opening.status` from `pre-opening` to `open` and rebuild.

Dependency updates include Astro 7.3.2, Sharp 0.35.4, Vite 8 and Vitest 4, plus current compatible tooling. A same-major `fast-uri` override closes an advisory in the editor/checker dependency chain. See the final QA entry for completed checks and any remaining limits.
