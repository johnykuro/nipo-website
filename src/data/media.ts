import type { ImageMetadata } from "astro";
import sushi from "../assets/photos/approved/salmon-sushi.png";
import steak from "../assets/photos/approved/steak-salad.png";
import cocktail from "../assets/photos/approved/botanical-cocktail.png";
import tuna from "../assets/photos/approved/sesame-tuna-bites.png";
import tartare from "../assets/photos/approved/fish-avocado-tartare.png";
import chicken from "../assets/photos/approved/chicken-skewers.png";
import blueRice from "../assets/photos/approved/blue-rice-rolls.png";
import meringue from "../assets/photos/approved/passionfruit-meringue.png";
import wine from "../assets/photos/wine/wine-pour.png";
export interface PhotoAsset {
  id: string; src: ImageMetadata; alt: string; caption: string;
  position: string; mobilePosition: string; placeholder: boolean;
}
// Approved AI-generated imagery based on the team's NIPO food photographs.
// Source mappings and exact prompts: output/imagegen/nipo-food-v1/.
export const photos: PhotoAsset[] = [
  { id: "salmon-sushi", src: sushi, alt: "Five salmon-topped sushi rolls with chilli and yellow fruit garnish on a bronze ceramic platter", caption: "Salmon sushi, finished with colour and care.", position: "50% 50%", mobilePosition: "60% 50%", placeholder: false },
  { id: "steak-salad", src: steak, alt: "Sliced bone-in steak with a salad of leaves and edible flowers", caption: "Sliced steak, made for sharing.", position: "50% 50%", mobilePosition: "64% 50%", placeholder: false },
  { id: "botanical-cocktail", src: cocktail, alt: "A layered green cocktail with a magenta flower in a cut-glass tumbler", caption: "A botanical finish to the evening.", position: "72% 50%", mobilePosition: "72% 50%", placeholder: false },
  { id: "sesame-tuna-bites", src: tuna, alt: "Four sesame-crusted tuna bites on crisp golden bases with sauce and dill", caption: "Sesame-crusted tuna with a little crunch.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: false },
  { id: "fish-avocado-tartare", src: tartare, alt: "Layered tuna, salmon and avocado tartare topped with lotus-root crisps", caption: "Tuna, salmon and avocado, carefully layered.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: false },
  { id: "chicken-skewers", src: chicken, alt: "Glazed chicken skewers with char marks over lettuce and radicchio", caption: "Glazed chicken, finished with char.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: false },
  { id: "blue-rice-rolls", src: blueRice, alt: "Five blue rice vegetable sushi rolls on a bronze platter with a dipping sauce", caption: "Vegetable rolls with a distinctive blue finish.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: false },
  { id: "passionfruit-meringue", src: meringue, alt: "Layered white meringue with cream and golden passion fruit", caption: "Passion fruit and meringue to finish.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: false },
];
// Menu-only image. Source and prompt: output/imagegen/nipo-wine-v1/.
const winePhoto: PhotoAsset = {
  id: "wine-pour", src: wine, alt: "Red wine being poured into one of two stemmed glasses on a candlelit dark timber table",
  caption: "A bottle for the table.", position: "50% 50%", mobilePosition: "50% 15%", placeholder: false,
};
export function photo(id: string): PhotoAsset {
  const asset = [...photos, winePhoto].find((item) => item.id === id);
  if (!asset) throw new Error("Unknown photo: " + id);
  return asset;
}
