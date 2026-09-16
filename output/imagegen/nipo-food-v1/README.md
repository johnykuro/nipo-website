# NIPO food imagery — review collection 01

Eight AI-generated images based on the team's NIPO food photography, produced with the **built-in image_gen tool**. Generated on 15 September 2026. These are generated interpretations of the supplied dishes, not documentary photographs.

## Review the collection

- Open `index.html` in a browser for original/generated comparisons and downloads.
- `review-sheet.png` shows all eight images, uncropped and labelled.
- `crop-proofs.png` shows the three proposed hero images with desktop and mobile framing and approximate existing website copy/overlays.
- `previews/` contains the six individual 1440 × 900 desktop and 390 × 844 mobile proofs.

## Files and dimensions

- `masters/`: eight unaltered generated PNGs. Landscape masters are **1672 × 941**; portrait masters are **1122 × 1402**.
- `exports/`: JPEG and WebP copies at **2560 × 1440 landscape** or **1600 × 2000 portrait**. These are upscaled formatting exports, not native generations at that resolution. Resampling does not add true photographic detail. Very small edge adjustments establish exact aspect ratios.
- `sources/`: unchanged copies of the eight primary team photographs. Original files in Creative Cloud were preserved.
- `prompts.json`: exact prompts, subject/style input paths, target dimensions and generator output paths.
- `catalogue.json`: source mappings, native and export dimensions, master SHA-256 hashes, suggested placements and crop positions.
- `package-review.mjs`: reproducible packaging script; creates format exports and review proofs, without generative retouching. Run from this project's environment with `node output/imagegen/nipo-food-v1/package-review.mjs`.

## Suggested placements

| Asset | Suggested use | Desktop position | Mobile position |
| --- | --- | --- | --- |
| salmon-sushi | Hero 1; food menu preview; Concept; social card | 50% 50% | 60% 50% |
| steak-salad | Hero 2; full-width menu feature; Concept | 50% 50% | 64% 50% |
| botanical-cocktail | Hero 3; drinks preview; gallery rail | 50% 50% | 72% 50% |
| sesame-tuna-bites | Gallery; starters feature; gallery rail | 50% 50% | 50% 50% |
| fish-avocado-tartare | Gallery; food detail; gallery rail | 50% 50% | 50% 50% |
| chicken-skewers | Gallery; robata feature; gallery rail | 50% 50% | 50% 50% |
| blue-rice-rolls | Gallery; vegetable sushi feature | 50% 50% | 50% 50% |
| passionfruit-meringue | Gallery; dessert feature | 50% 50% | 50% 50% |

Names are descriptive image labels, not confirmed menu titles. Any integration should use accurate new captions: for example, the sliced bone-in steak should not retain the placeholder's caption about picanha cooking on a grill.

## Visual direction and checks

The existing sushi placeholder supplied the initial lighting reference. The completed salmon image then served as the shared style reference for the other seven. All subject images remained authoritative for food and crockery: warm directional evening light, softly defocused green-black surroundings, dark timber and controlled highlights.

Visual inspection covered the source dishes, generated images, collection sheet and six hero crop proofs. The five-piece salmon and blue-rice portions, four tuna bites, layered tartare and lotus crisps, chicken skewers, steak/salad serving, cocktail layering/glass/flower, and meringue/passion-fruit presentation remain recognisable. No obvious malformed glass rims, unintended text or unrelated food additions were identified. The cocktail flower arrangement and small sauce/garnish details remain generative interpretations rather than exact pixel preservation.

Desktop crops preserve a calm left area for copy. Tall mobile crops show food details, not the entire platter. The current centred hero copy overlaps part of each subject; the cocktail is especially prominent behind it. The proofs expose this tradeoff for review, with overlays keeping the lettering readable. Some portrait plate rims leave the frame, consistent with close food photography, while the principal food is visible. Final positioning must be checked against the actual page when integration is requested.

Technical checks verified that saved masters and reference copies match their originating files byte-for-byte, and that all sixteen JPEG/WebP exports have the requested dimensions. This review package changes no website image imports, page layouts, captions or deployment state.
