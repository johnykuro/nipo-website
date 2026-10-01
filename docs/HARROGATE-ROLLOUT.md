# Harrogate rollout and rollback

## Checkpoint — 1 October 2026

- Git tag (pushed): `checkpoint/pre-harrogate-2026-10-01`
- Source commit: `87af6304d9907aa8b3033851baa329e39adea5f0`
- Netlify project: `c490bf73-674f-45e5-854f-fa8923035963`
- Production deployment: `6ab694046a1199000865956e` (ready; commit matches the tag)
- Immutable preview: https://6ab694046a1199000865956e--nipo-website.netlify.app
- Implementation branch: `codex/harrogate-locations`

For immediate rollback, publish that recorded deployment through Netlify's deployment controls. Then revert the rollout commits on main and deploy the revert so later builds preserve the restored source. Do not reset shared Git history or delete contacts. The additive Harrogate environment variable can remain; the checkpoint code does not use it.

## Harrogate configuration

Set `BREVO_HARROGATE_LIST_ID=13` in Netlify function environments. List name: **NIPO Harrogate VIP**, in the existing Brevo account. Keep `BREVO_LIST_ID` and existing secrets unchanged. No welcome-email automation is added. The form confirms signup on the website.

The same optional setting is supported in the retained Cloudflare Worker. Missing or invalid Harrogate configuration must return a retryable error, never fall back to the general list. Existing forms without a location retain their existing destination. Do not change blacklist status or unlink existing lists when adding a contact.

## Publication rules

Harrogate introduces a Japanese-Brazilian steakhouse with robata-style cooking. Publish only Parliament St, Harrogate HG1 2RL and the coming-soon status. Do not publish menus, prices, hours, a telephone number, a dated opening or reservations until separately confirmed. Keep Newcastle's operational information on its own page. Existing menu pages identify Newcastle explicitly.

The permanent Newcastle route is `/locations/newcastle/`; `/contact` and `/contact/` redirect there and browsers retain the original `#faq` fragment. Harrogate is `/locations/harrogate/`.

## Verification — 1 October 2026

- `pnpm test`: 47 API tests and 6 deployment/gallery tests passed.
- Production and noindex preview builds passed Astro checks and generated-page SEO verification (11 indexable pages, 270 menu items).
- Existing browser regression: 15 checks passed.
- New location layouts: 20 page/viewport checks passed at 360, 390, 768, 1024 and 1440 pixels; signup retry/success, location payload, mobile VIP action and contact/FAQ redirect checks passed.
- Consent: 8 checks passed. The local fixture keeps optional analytics loaders inert so third-party analytics scripts do not execute during these tests.
- Brevo read-only verification confirmed list 13 is named NIPO Harrogate VIP; its count was zero at verification. The existing API credential and new function setting are configured. Existing-contact and duplicate-submission behaviour is covered with mocked provider responses; no live subscriber was created and no welcome-email automation was added.
- Hosted preview: https://6abe35cf01263f2fb699ec5b--nipo-website.netlify.app — page status, canonical URLs, noindex, contact 301 with query preservation, field validation and invalid challenge rejection passed. Successful Turnstile-to-Brevo delivery still requires a real consenting subscriber; tests do not bypass the production challenge.
