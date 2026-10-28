import type { MenuSection } from "./menus";

// Content matches NIPO-childrens-menu-WEB.pdf supplied on 28 October 2026.
// 12.95 is the price of the complete menu, not an individual dish.
export const childrensSections: MenuSection[] = [
  { title: "Fresh juices", dishes: [
    { name: "Orange, apple and cranberry" },
  ] },
  { title: "Mains", note: "All served with fries.", dishes: [
    { name: "Little Samurai Steak", details: "4 oz", description: "Rump steak cooked to preference." },
    { name: "Golden Chicken Katsu", description: "Crispy panko chicken with a mild Japanese curry sauce." },
    { name: "Little Sushi Stars", description: "Six small rolls: salmon, cream cheese and avocado, golden crisp shallots." },
  ] },
  { title: "To finish", dishes: [
    { name: "Ice Cream", description: "Choice of vanilla or chocolate." },
  ] },
];
