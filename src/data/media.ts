import type { ImageMetadata } from "astro";
import galleryLibrary from "./gallery.json";
import meringue from "../assets/photos/approved/passionfruit-meringue.png";
import heroSushiTable from "../assets/photos/hero-2026-09/DSC07608-Edit.jpg";
import heroSteak from "../assets/photos/hero-2026-09/DSC08020-Edit.jpg";
import heroChopsticks from "../assets/photos/hero-2026-09/DSC07617-Edit.jpg";
import heroShank from "../assets/photos/hero-2026-09/DSC08176-Edit.jpg";
import heroLamb from "../assets/photos/hero-2026-09/DSC08115-Edit.jpg";
export interface PhotoAsset {
  id: string; src: ImageMetadata; alt: string; caption: string;
  position: string; mobilePosition: string; placeholder: boolean;
}
// The local editor saves owner-written descriptions here. Blank means no caption.
const galleryImages = import.meta.glob<ImageMetadata>(
  "../assets/photos/{shoot-2026-09,hero-2026-09,gallery}/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);
export const photos: PhotoAsset[] = galleryLibrary.images.map((entry, index) => {
  const src = galleryImages["../" + entry.file.replace(/^src\//, "")];
  if (!src) throw new Error("Missing gallery image: " + entry.file);
  return {
    id: entry.id, src, caption: entry.description,
    alt: entry.alt || entry.description || "NIPO photograph " + (index + 1),
    position: entry.position, mobilePosition: entry.mobilePosition, placeholder: false,
  };
});
// Owner-selected hero files from the gallery folder, kept separate from gallery assets.
const heroPhotos: PhotoAsset[] = [
  { id: "hero-sushi-table", src: heroSushiTable, alt: "A spread of sushi with white wine beneath NIPO's red foliage", caption: "A table to share at NIPO.", position: "50% 60%", mobilePosition: "62% 60%", placeholder: false },
  { id: "hero-sliced-steak", src: heroSteak, alt: "Sliced bone-in steak with greens and two sauce jugs on a ceramic platter", caption: "Sliced steak, made for sharing.", position: "50% 50%", mobilePosition: "55% 50%", placeholder: false },
  { id: "hero-sushi-chopsticks", src: heroChopsticks, alt: "A blue rice vegetable roll lifted with chopsticks above platters of sushi", caption: "Discover a new favourite.", position: "60% 45%", mobilePosition: "61% 45%", placeholder: false },
  { id: "hero-braised-shank", src: heroShank, alt: "A braised shank in a dark bowl beside a woven chair under warm restaurant lighting", caption: "Slow cooked, generously served.", position: "50% 50%", mobilePosition: "65% 50%", placeholder: false },
  { id: "hero-lamb-cutlets", src: heroLamb, alt: "Grilled lamb cutlets with herbs on a striped ceramic plate beside red wine", caption: "From the grill to your table.", position: "62% 50%", mobilePosition: "66% 50%", placeholder: false },
];
// No dessert image was supplied in the professional shoot. Retain the existing menu-only image.
const dessertPhoto: PhotoAsset = {
  id: "passionfruit-meringue", src: meringue, alt: "Layered white meringue with cream and golden passion fruit",
  caption: "Passion fruit and meringue to finish.", position: "50% 50%", mobilePosition: "50% 50%", placeholder: true,
};
export function photo(id: string): PhotoAsset {
  const asset = [...photos, ...heroPhotos, dessertPhoto].find((item) => item.id === id);
  if (!asset) throw new Error("Unknown photo: " + id);
  return asset;
}
