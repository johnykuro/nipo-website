# SEO and AEO review — 1 October 2026

## Changes

- Added an ItemList to the Locations hub, linked from its CollectionPage schema, with the two canonical location URLs.
- Added the Newcastle menus parent to dessert, drinks and wine breadcrumbs. This makes their relationship to the existing Newcastle menu section explicit.
- Added Newcastle Quayside to the wine page description.
- Made the Newcastle introduction FAQ location-specific, and added a Harrogate address FAQ generated from the same address data as its page and Restaurant schema.
- Nested the homepage location names under the Find Your NIPO heading for a clearer heading hierarchy.
- Extended the build checks to cover directory schema, menu breadcrumb parents and all three social-card dimensions.

## Findings

The two-location rollout retains distinct Restaurant IDs and a shared brand Organization. Harrogate's title, description, visible introduction and FAQ identify the steakhouse, robata-style cooking, Parliament Street and the coming-soon status. Its schema excludes menus, prices, hours, telephone, email, reservations and an opening date. Newcastle's contact and booking details remain associated with Newcastle.

The generated-page checks cover all 11 indexable pages: unique titles and descriptions, one H1, canonical URLs, social metadata, JSON-LD IDs, matching visible FAQ answers and menu prices, local links and anchors, sitemap coverage, robots rules and preview indexing policy. The contact redirect retains the Newcastle destination. No critical SEO regression was found in these checks.

## Search guidance

Google's [current guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) prioritises useful content and ordinary technical SEO. It does not require special AI schema or an llms.txt file. The improvements here clarify actual location information and navigation.

Google [retired FAQ rich results in May 2026](https://developers.google.com/search/updates#may-2026). The visible FAQs and matching Schema.org FAQPage data remain useful descriptions of the page; they are not a promise of Google FAQ rich results. Restaurant data follows the [Local Business guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business), with unknown Harrogate fields omitted.

## Verification limits and follow-up

Release baseline: production deployment `6abe3a9919b6f50008ccaa73`, commit `cfc9551a6cc77cd5651f2cf0965b7f4ce7b6d425`. The original pre-Harrogate checkpoint remains recorded in `HARROGATE-ROLLOUT.md`.

These are source, generated HTML and browser checks, not a Search Console indexing report or a Google Rich Results Test result. They do not establish rankings, AI citations or field Core Web Vitals. After release, use Search Console to inspect both location URLs and the sitemap, and monitor indexing and traffic. Review each venue's Google Business Profile separately when its publication details are confirmed.

Keep Harrogate's unpublished operational details out of visible content and schema until separately approved.
