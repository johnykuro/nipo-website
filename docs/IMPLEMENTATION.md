# NIPO website maintenance

## Opening status

`src/config/site.ts` is the source of truth. It currently has status `pre-opening`, date `2026-09-23`, and display label `23 September 2026`. Change the status to `open` when the restaurant opens. Home metadata, hero, footer, Contact announcement, opening FAQ and VIP introduction/success copy respond to that switch. The site does not change status automatically.

The owner confirmed: opening 23 September 2026; Monday–Thursday, noon–9pm; Friday–Saturday, noon–10pm; Sunday, noon–8pm; telephone 0191 222 1122; restaurant email newcastle@nipobraza.co.uk; company/privacy email info@nipobraza.co.uk. The address is 95 Quayside, Newcastle upon Tyne NE1 3DH. The grouped hours in `siteConfig.hours` feed the Contact page, FAQs and Restaurant schema. The opening-hours schema starts on the opening date.

## Food, drinks and wine

Menu selections and 68 sample dishes live in `src/data/menus.ts`. They exclude prices and internal notes. Menu schema is generated from the same visible dish names and descriptions; it makes no dietary guarantees. The owner asked to leave the current Nigiri Vegetarian Selection entry unchanged; its VG label and tamago description still need a future content review.

To publish the final food PDF, add the approved web PDF under `public/menus/`, then update the first menu link's title, href and pdf flag in the data file. The existing layout, hover preview and mobile link need no redesign. The sample HTML can remain as a taste of the menu, or its copy/dishes can be updated in the same data file.

Drinks source: `Menus/NIPO-drink-menu-booklet-A5.pdf` (12 pages).
Wine source: `Menus/NIPO Wine List/NIPO-wine-list-2026.pdf` (8 pages).
Both are from the supplied Nipo Steakhouse folder. Website copies set MediaBox and CropBox to each page's existing TrimBox. Content streams and source files remain unchanged. Recreate them with `scripts/prepare-menu-pdfs.py` and the two source paths, using Python with pypdf installed. Inspect all rendered pages after replacing a print source.

## Photography and video

See IMAGERY.md for replacement instructions. Slideshow IDs and the 7000ms interval live in `site.ts`; captions and focal positions live in `media.ts`. The first photograph is prioritised. Other imagery is lazy loaded, with AVIF/WebP generated at build time.

For future video, set `hero.mode` to `video` and supply a direct playable MP4/WebM URL via the existing `PUBLIC_VIMEO_VIDEO_URL` variable. An ordinary Vimeo watch-page URL is not a media source. Update `video.poster` to an approved poster file. The first slideshow photograph remains the fallback if autoplay fails, video errors, reduced motion or data saver prevents playback. A video is never requested in the default slideshow mode.

## VIP signup

The original `/api/vip-signup` JSON contract, first name/email validation, explicit marketing consent, honeypot, start time, Turnstile challenge, backend limits and Brevo integration are retained. Signup remains on Home; other pages link to `/#vip`.

The production preview serves static files only. Browser regression checks use the local QA server on port 4323, which returns mock endpoint responses and removes the external challenge script. They supply a local mock token and verify UI behavior without submitting contacts. Existing Worker tests verify server validation, Turnstile handling, duplicate contacts and upstream failures.

## Layout and accessibility

Page navigation uses ordinary links. Without scripts, the first hero image, sample menu and PDF/gallery image links remain available. Mobile gets a fallback navigation row. Dialogs provide Escape, focus containment and restoration. Lightbox controls support arrow keys and horizontal swipe. Reduced motion disables automatic slideshow/rail movement; manual navigation remains available.

Playfair Display is self-hosted. Sans-serif uses the existing Avenir/Helvetica/Arial fallback until licensed Gotham webfonts are supplied. Logo artwork is retained; footer botanical artwork comes from brand-guide page 18.
