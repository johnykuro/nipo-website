# NIPO website imagery

## Complete gallery and owner-written descriptions — 24 September 2026

The gallery now contains 70 unique photographs: the existing 13 plus 57 new photographs from the owner's `Website Images/gallery` folder. Ten of that folder's 67 files matched existing gallery photographs and were skipped. The importer checks decoded image content, so changing a filename or metadata cannot create a duplicate. Originals are preserved; missing files were copied to `src/assets/photos/gallery/`.

`src/data/gallery.json` is now the authoritative gallery manifest and caption source. Run `pnpm gallery:edit` to enter descriptions beside the photographs. Blank descriptions show no caption; previous generated captions have been removed from the gallery and its shared photo records. A neutral numbered accessibility label is used until the owner supplies wording. See [the gallery editor guide](GALLERY-EDITOR.md) for saving, exporting and future imports. The earlier sections below document the initial shoot integration.

## Owner-selected hero slideshow — 24 September 2026

The homepage hero uses these five photographs in the owner's chosen order. Exact originals from `C:/Users/jonmc/Creative Cloud Files Personal Account/Other Brands/Nipo Steakhouse/Website Images/gallery/` are preserved in `src/assets/photos/hero-2026-09/`, independently of the earlier shoot collection. All are 2048×1365; responsive focal positions control desktop and phone crops without altering originals.

| Slide | Website ID | Original filename |
| --- | --- | --- |
| 1 | hero-sushi-table | DSC07608-Edit.jpg |
| 2 | hero-sliced-steak | DSC08020-Edit.jpg |
| 3 | hero-sushi-chopsticks | DSC07617-Edit.jpg |
| 4 | hero-braised-shank | DSC08176-Edit.jpg |
| 5 | hero-lamb-cutlets | DSC08115-Edit.jpg |

The slideshow retains its seven-second interval. Its initial counter derives from the configured slide count.

## Professional shoot — integrated 24 September 2026

The main website and Gallery now use the 13 professional shoot photographs supplied by the owner. Originals were copied byte-for-byte from `C:/Users/jonmc/Creative Cloud Files Personal Account/Other Brands/Nipo Steakhouse/Website Images/photo-shoot/` to `src/assets/photos/shoot-2026-09/`. No generative editing, retouching, upscaling or destructive source crops were applied. Responsive frames use focal positions in `src/data/media.ts`; Astro supplies AVIF and WebP sizes from 480px up to each original's native width.

| Website ID | Original filename | Main placement |
| --- | --- | --- |
| sushi-table | DSC07608-Edit.jpg | Concept card, Contact, rail, Gallery, social preview |
| sliced-steak | DSC08020-Edit.jpg | Home menus feature, rail, Gallery |
| small-plates | DSC07295-Edit-2.jpg | Home Gallery card, rail, Gallery |
| lime-cocktail | DSC07220-Edit.jpg | Drinks preview, hospitality, rail, Gallery |
| blue-rice-rolls | DSC07560-Edit.jpg | Gallery |
| sushi-chopsticks | DSC07617-Edit.jpg | Concept opening, rail, Gallery |
| maki-platter | DSC07743-Edit.jpg | Gallery |
| beef-sushi-rolls | DSC07777-Edit.jpg | Main Menu preview, Concept, Gallery |
| fish-skillet | DSC08148-Edit-2.jpg | Gallery |
| braised-shank | DSC08179-Edit-2.jpg | Rail, Gallery |
| lamb-cutlets | DSC08115-Edit.jpg | Gallery |
| steak-on-fire | DSC07802-Edit.jpg | Concept fire section, Gallery |
| wine-and-oysters | DSC07474.jpg | Wine preview, Gallery |

The initial shoot integration used generated captions and alt text; the owner-written description workflow above replaces those for gallery records. Gallery lightbox images are capped at 1600px; the original aspect ratios are retained. CSS crops keep each photographed subject visible in desktop and mobile frames. The 1200×630 social preview uses the photographed sushi table with the existing brand overlay.

## Remaining temporary image

No dessert photography was provided in this shoot. `passionfruit-meringue` remains a menu-only AI-generated image from the previous approved collection, with `placeholder: true`. It appears when Dessert is selected and on the dessert page. It is excluded from the professional Gallery. Replace it once a dessert photograph is supplied.

## Preserved earlier work

The previous generic placeholders and AI-generated food and wine images remain in `src/assets/photos/` for history. Apart from the dessert image noted above, they are no longer imported by the active website. Original generation prompts and review collections remain under `output/imagegen/`. The public Gallery AI-origin note remains removed as requested by the owner.

## Future updates

Import new gallery photography with `pnpm gallery:import "path/to/folder"`, then supply captions through `pnpm gallery:edit`. Check captions and lightbox labels whenever the pictured subject changes. Verify hero text legibility and crop positions on phone, tablet and desktop. Update `scripts/generate-social.mjs` and BaseLayout's social alt text when changing social imagery. Run the asset generator, production build and browser image/layout checks.
