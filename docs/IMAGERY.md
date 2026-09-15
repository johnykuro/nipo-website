# NIPO imagery

## Current collection — approved 15 September 2026

The website uses eight approved AI-generated images based on the team's photographs of NIPO food and drinks. They are not documentary photos. Provenance is recorded here and in the review collection; the public Gallery origin note was removed at the owner's request on 15 September 2026.

Native PNG masters are copied unchanged into `src/assets/photos/approved/`. Astro generates responsive AVIF and WebP versions, with lightbox widths capped at the lesser of 1600 pixels and the source width. The upscaled review exports are not used as website sources.

| ID | Subject | Main uses | Desktop / mobile position |
| --- | --- | --- | --- |
| salmon-sushi | Five salmon-topped sushi rolls | Hero 1, food menu preview, Concept, rail, Gallery, social card | 50% 50% / 60% 50% |
| steak-salad | Sliced bone-in steak and flower salad | Hero 2, Home menus feature, Concept, wine-pairing preview, rail, Gallery | 50% 50% / 64% 50% |
| botanical-cocktail | Layered green cocktail with magenta flower | Hero 3, drinks preview, hospitality, rail, Gallery | 72% 50% / 72% 50% |
| sesame-tuna-bites | Sesame-crusted tuna on crisp golden bases | Contact, Home Gallery feature, rail, Gallery | 50% 50% / 50% 50% |
| fish-avocado-tartare | Tuna, salmon and avocado with lotus crisps | Concept opening, Home concept feature, rail, Gallery | 50% 50% / 50% 50% |
| chicken-skewers | Glazed chicken on metal skewers | Rail, Gallery | 50% 50% / 50% 50% |
| blue-rice-rolls | Blue rice vegetable sushi | Gallery | 50% 50% / 50% 50% |
| passionfruit-meringue | Meringue, cream and passion fruit | Gallery | 50% 50% / 50% 50% |

Landscape masters are 1672 × 941; portrait masters are 1122 × 1402. The cocktail uses 72% horizontal positioning on desktop as well as mobile so the glass remains visible in narrower drinks and hospitality frames. Tall hero crops show a food detail; the existing text overlays remain in use.

`src/data/media.ts` owns accurate alt text, captions and focal positions. `placeholder: false` means the image was approved for use; it does not imply documentary photography. Dish labels are descriptive and must not inherit the old placeholder captions about picanha on a grill, black cod, moqueca or cheesecake.

## Provenance and review

The Home “The NIPO concept” card uses the approved tartare image. The alternative shared-table composition was rejected and deleted at the owner's request on 15 September 2026.

`output/imagegen/nipo-food-v1/` contains the full original/generated comparison package, exact prompts, source filenames and hashes, original reference copies, native masters and labelled crop proofs. The review packet is a snapshot of the image approval stage; website integration is documented here. The current site files are identical to the approved masters.

The eight previous generic placeholders, their original prompts and catalogue remain in `src/assets/photos/` for provenance. None is imported by the active website.

## Future changes

1. Add approved replacement images to a new folder and update the corresponding imports and metadata in `src/data/media.ts`.
2. If the subject changes, use a descriptive ID and update its consumers in page components, hero slide configuration and menu previews. Check gallery captions and lightbox labels.
3. Check all hero slides at 1440×900, 1024×768, 390×844 and 360×800. Preserve heading readability and recognisable food under portrait cropping. Also check Concept, Contact and menu preview frames.
4. Update `scripts/generate-social.mjs` when the social photograph changes, and update BaseLayout's social-image alt text to match. Run `pnpm generate:assets` and `pnpm build`.
5. Update these provenance notes when the imagery changes. Run the image containment and gallery/lightbox browser checks.

## Brand artwork

The compact NIPO logo, footer lockup and `public/brand/botanical.webp` remain supplied brand artwork, separate from the food collection.
