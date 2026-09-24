# NIPO website maintenance

## Opening status

`src/config/site.ts` is the source of truth. The status is `open`: Home metadata describes the restaurant and the opening-date FAQ is omitted. The hero shows the location without an opening announcement; the footer and Contact page have no opening announcement. The historical opening date remains in the configuration for opening-hours schema. The site does not change status automatically.

The owner confirmed: opening 23 September 2026; Monday–Thursday, noon–9pm; Friday–Saturday, noon–10pm; Sunday, noon–8pm; telephone 0191 222 1122; restaurant email newcastle@nipobraza.co.uk; company/privacy email info@nipobraza.co.uk. The address is 95 Quayside, Newcastle upon Tyne NE1 3DH. The grouped hours in `siteConfig.hours` feed the Contact page, FAQs and Restaurant schema. The opening-hours schema starts on the opening date.

## Food, drinks and wine

Menu selections and 71 confirmed entries with GBP prices live in `src/data/menus.ts`. The main menu is at `/menus/#main-menu`; its six dessert entries are also rendered at `/menus/dessert/#dessert-menu` using the same data and FoodMenu component. Names, descriptions, portions and prices follow the supplied NIPO-main-menu-WEB.pdf and NIPO-dessert-menu-WEB.pdf. The source labels for Nigiri Vegetarian Selection are retained; no dietary guarantees are inferred in schema.

The Main and Dessert PDF links point to unchanged copies at `public/menus/nipo-main.pdf` and `public/menus/nipo-dessert.pdf`. Replace them when approved PDFs change and update the HTML data in the same change. Menu schema uses the visible dish data and GBP Offer prices. The owner confirmed Blue Matcha Garden Roll at £8 in both website sections. The supplied PDF is unchanged and still lists £9 in Plant-led small plates.

Drinks and Wine have matching HTML pages at `/menus/drinks/` and `/menus/wine/`. Their full lists live in `src/data/drinks.ts` (154 entries) and `src/data/wine.ts` (39 entries). Each serving keeps its own label and price; bottle-only wines do not imply availability by the glass. All displayed menu prices omit the currency symbol; schema continues to identify GBP.

All four entries in `MenuBrowser` use ordinary HTML links and the same separate `View PDF` control. Website PDFs are unchanged copies of the supplied web exports. Drinks source: `Menus/NIPO-drink-menu-WEB.pdf` (10 pages, 779,263 bytes). Wine source: `Menus/NIPO Wine List/NIPO-wine-list-WEB.pdf` (6 pages, 179,497 bytes). Do not run the older print-PDF trimming script on these exports.

## Photography and video

See IMAGERY.md for replacement instructions. Slideshow IDs and the 7000ms interval live in `site.ts`; captions and focal positions live in `media.ts`. The first photograph is prioritised. Other imagery is lazy loaded, with AVIF/WebP generated at build time.

For future video, set `hero.mode` to `video` and supply a direct playable MP4/WebM URL via the existing `PUBLIC_VIMEO_VIDEO_URL` variable. An ordinary Vimeo watch-page URL is not a media source. Update `video.poster` to an approved poster file. The first slideshow photograph remains the fallback if autoplay fails, video errors, reduced motion or data saver prevents playback. A video is never requested in the default slideshow mode.

## Newsletter signup

The restaurant newsletter signup appears on Home at `/#newsletter`, linked from Contact and the footer. Its copy covers new dishes, seasonal menus and restaurant news. The original `/#vip` anchor remains as a compatibility target for old links. The existing `VipSignup.astro` component and `/api/vip-signup` backend retain their internal names and existing Brevo integration, validation, consent and Turnstile protection; all public form messaging refers to the newsletter.

The production preview serves static files only. Browser regression checks use the local QA server on port 4323, with mock signup responses and a local challenge token. Newsletter validation, success, server-error and network-error scenarios are retained. Existing backend tests verify the signup service without submitting real contacts.

## Layout and accessibility

Page navigation uses ordinary links. Without scripts, the first hero image, food menus and PDF/gallery image links remain available. Mobile gets a fallback navigation row. Dialogs provide Escape, focus containment and restoration. Lightbox controls support arrow keys and horizontal swipe. Reduced motion disables automatic slideshow/rail movement; manual navigation remains available.

Playfair Display is self-hosted. Sans-serif uses the existing Avenir/Helvetica/Arial fallback until licensed Gotham webfonts are supplied. Logo artwork is retained; footer botanical artwork comes from brand-guide page 18.
