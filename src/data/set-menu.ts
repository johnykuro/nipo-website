import type { MenuSection } from "./menus";

// Transcribed from the supplied NIPO-set-menu-WEB.pdf, including supplements.
export const setSections: MenuSection[] = [
  { title: "A taste of NIPO", note: "Available Sunday–Friday, 12–5pm.", dishes: [
    { name: "2 courses", price: 24.95 },
    { name: "3 courses", price: 29.95 },
  ] },
  { title: "For the table", dishes: [
    { name: "Prawn Crackers", description: "Served with dipping sauce." },
  ] },
  { title: "Starter", dishes: [
    { name: "Chicken Yakitori", details: "2 pcs", description: "Tender grilled chicken thigh skewers glazed with sweet-savoury yakitori sauce. Served with kimchi." },
    { name: "Croquete de Costela", details: "3 pcs", description: "Rich braised short rib croquettes with tonkatsu, creamy kewpie mayonnaise and green onion." },
    { name: "São Paulo Roll", description: "Salmon, cream cheese and avocado, golden crisp shallots, sweet soy drizzle." },
    { name: "Salmon Samba Roll", description: "Fresh salmon and mango with chilli, lime, coriander and toasted sesame." },
    { name: "Blue Matcha Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
    { name: "Fillet Tataki", priceNote: "+5 supplement", description: "Lightly seared centre-cut beef fillet steak with ponzu, chilli, sesame & spring onion." },
  ] },
  { title: "Main", dishes: [
    { name: "Chicken Yakisoba", description: "Chargrilled chicken, fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
    { name: "Mahi Mahi Moqueca", description: "Mahi Mahi fillet simmered in an aromatic Brazilian stew of tomato, bell peppers, garlic, lime, paprika, cayenne and coriander." },
    { name: "Costela NIPO", priceNote: "+5 supplement", description: "Tender slow-cooked beef rib with silky creamy mandioca and sharp pickled shallot." },
    { name: "Lamb Cutlets", priceNote: "+5 supplement", description: "Charred lamb cutlets with Brazilian-Japanese herb miso chimichurri." },
    { name: "Bistro Rump Steak", priceNote: "+5 supplement", description: "Tender central cut rump steak, robata flame grilled to your preference. Served with Maldon salt, wasabi, house seasoned fries & ginger rice." },
    { name: "Vegetable Yakisoba", details: "VG", description: "Fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
  ] },
  { title: "Dessert", dishes: [
    { name: "Berry & Chocolate Fusion", description: "Juicy blueberries, raspberries and blackberries with silky dark chocolate ganache, guava gel and sesame crunch. (Vegan option available.)" },
    { name: "Passion Fruit Pavlova", description: "Crisp-soft meringue with light cream and vibrant Brazilian passion fruit." },
    { name: "Matcha & White Chocolate Cheesecake", description: "Matcha cheesecake with delicate white chocolate accents and yuzu gel." },
  ] },
  { title: "Sides", dishes: [
    { name: "House Seasoned Fries", priceNote: "+5" },
    { name: "Chilli & Sesame Tenderstem Broccoli", priceNote: "+5" },
  ] },
  { title: "Sauces", dishes: [
    { name: "Peppercorn", priceNote: "+4" },
    { name: "Chimichurri", priceNote: "+4" },
  ] },
];
