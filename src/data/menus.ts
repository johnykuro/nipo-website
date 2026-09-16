export const menuLinks = [
  { title: "Main Menu", description: "Sushi, small plates & the robata", href: "/menus/#main-menu", photoId: "salmon-sushi", pdfHref: "/menus/nipo-main.pdf" },
  { title: "Dessert", description: "Hand-finished & freshly made in-house", href: "/menus/dessert/#dessert-menu", photoId: "passionfruit-meringue", pdfHref: "/menus/nipo-dessert.pdf" },
  { title: "Drinks", description: "Cocktails, sake & spirits", href: "/menus/drinks/#drinks-menu", photoId: "botanical-cocktail", pdfHref: "/menus/nipo-drinks.pdf" },
  { title: "Wine", description: "A bottle for the table", href: "/menus/wine/#wine-menu", photoId: "wine-pour", pdfHref: "/menus/nipo-wine.pdf" },
];
export type MenuDish = {
  price: number;
  name: string;
  details?: string;
  description?: string;
  region?: string;
  servings?: { label: string; price: number }[];
};

export type MenuSection = {
  title: string;
  note?: string;
  dishes: MenuDish[];
};

// Prices and portions transcribed from the confirmed NIPO-main-menu-WEB.pdf.
// Owner confirmed Blue Matcha Garden Roll at £8 in both sections (PDF plant-led price is £9).
export const mainSections: MenuSection[] = [
  { title: "Snacks for the table", dishes: [
    { name: "Prawn Crackers", price: 4.5 },
    { name: "Salted Edamame Beans", price: 4.5 },
    { name: "Wakame Seaweed", price: 4.5 },
  ] },
  { title: "Small plates", dishes: [
    { price: 13, name: "Oysters", description: "Three raw oysters with nam jim, or three tempura oysters with dill and oyster emulsion." },
    { price: 16, name: "Fillet Tataki", description: "Lightly seared centre-cut beef fillet with ponzu, chilli, sesame and spring onion." },
    { price: 14, name: "Tuna Crispy Rice", details: "3 pcs", description: "Sesame-seared tuna on crisp rice with jalapeño and zesty yuzu mayonnaise." },
    { price: 9, name: "NIPO Beef Gyoza", details: "4 pcs", description: "Steamed gyoza dumplings filled with tender overnight-braised beef. Served with chilli & soy dip." },
    { price: 14, name: "Black Tiger Prawn Tempura", description: "Crisp black tiger prawns with creamy togarashi mayonnaise and Japanese tempura sauce." },
    { price: 13, name: "Atum & Salmão NIPO", description: "Fresh tuna and salmon tartare with creamy avocado, nikiri and crisp lotus root." },
    { price: 11, name: "Chicken Yakitori", details: "2 pcs", description: "Tender grilled chicken thigh skewers glazed with sweet-savoury yakitori sauce. Served with kimchi." },
    { price: 9, name: "Croquete de Costela", details: "3 pcs", description: "Rich braised short rib croquettes with tonkatsu, creamy kewpie mayonnaise and green onion." },
    { price: 9, name: "Hot Honey & Chilli Pork", details: "4 pcs", description: "Tender slow-cooked pork glazed with sweet, fiery hot honey and chilli." },
    { price: 9, name: "Duck Spring Roll", details: "2 pcs", description: "Crisp shredded duck spring rolls with a rich tonkatsu dipping sauce." },
  ] },
  { title: "Sushi fusion", note: "Made to share. All served with wasabi, pickled ginger and soy. Rolls and nigiri selections are four pieces.", dishes: [
    { price: 14, name: "Fillet Fire Roll", description: "Flame-seared beef fillet, avocado, crisp onion, chimichurri and mayonnaise." },
    { price: 13, name: "NIPO Tiger Roll", description: "Crisp tempura tiger king prawn, avocado, green tobiko and luxurious truffle mayo." },
    { price: 11, name: "São Paulo Roll", description: "Salmon, cream cheese and avocado, golden crisp shallots, sweet soy drizzle." },
    { price: 18, name: "Lobster Dragon Roll", description: "Lobster, avocado, yuzu mayonnaise and tobiko." },
    { price: 9, name: "Salmon Samba Roll", description: "Fresh salmon and mango with chilli, lime, coriander and toasted sesame." },
    { price: 12, name: "Trio Fish Mosaic", description: "Delicate trio of salmon, black cod and tuna, with pickled daikon and cucumber." },
    { price: 16, name: "Steak Nigiri", description: "Tender beef fillet nigiri, chimichurri, togarashi mayonnaise, wasabi mayonnaise and bonito flakes." },
    { price: 8, name: "Blue Matcha Garden Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
    { price: 14, name: "Tuna Sashimi", description: "Five delicate slices of fresh raw tuna." },
    { price: 11, name: "Salmon Sashimi", description: "Five delicate slices of fresh raw salmon." },
  ] },
  { title: "From the fire", note: "Robata grilled steaks. Served with Maldon salt, wasabi, house seasoned fries, NIPO salad & ginger rice.", dishes: [
    { price: 36, name: "Ribeye Robata", details: "10 oz", description: "Deeply marbled ribeye with a rich, yielding texture." },
    { price: 39, name: "Fillet Mignon Robata", details: "8 oz", description: "Exceptionally tender, lean fillet with a delicate texture." },
    { price: 35, name: "Sirloin Steak", details: "10 oz", description: "Well-marbled sirloin with a generous outer edge of fat." },
    { price: 54, name: "A5 Wagyu Sirloin", details: "4 oz", description: "Full-blood A5 Grade 11 Wagyu, among the world’s most prized beef, celebrated for extraordinary marbling and buttery tenderness." },
    { price: 59, name: "NIPO F1 Sirloin", details: "8 oz", description: "Black Angus × Wagyu crossbreed, combining tenderness and marbling." },
  ] },
  { title: "To share", dishes: [
    { price: 78, name: "Côte de Boeuf", details: "Avg. 32 oz", description: "Carved bone-in ribeye with two sides and two sauces of your choice." },
    { price: 89, name: "Wagyu F1 Picanha", details: "Avg. 24 oz", description: "Grilled Wagyu F1 picanha with two sides and two sauces of your choice." },
  ] },
  { title: "Fire & feast", note: "Large plates & sharing selections. Please note fish dishes may contain bones.", dishes: [
    { price: 28, name: "Costela NIPO", description: "Tender slow-cooked beef rib with silky creamy mandioca and sharp pickled shallot." },
    { price: 27, name: "Lamb Cutlets", description: "Charred lamb cutlets with Brazilian-Japanese herb miso chimichurri." },
    { price: 26, name: "Miso Kuro Cod", details: "May contain bones", description: "Premium, delicate black cod caramelized with a rich, sweet Japanese miso glaze, elevated by vibrant pickled ginger and nutty sesame notes." },
    { price: 18, name: "Mahi Mahi Moqueca", details: "May contain bones", description: "Mahi Mahi fillet simmered in an aromatic Brazilian stew of tomato, bell peppers, garlic, lime, paprika, cayenne and coriander." },
    { price: 28, name: "Slow-Cooked Lamb Shank", description: "Slow-cooked lamb, silky yuca aligot and crisp onion." },
    { price: 16, name: "NIPO Chicken Wok Noodles", description: "Chargrilled chicken, fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
    { price: 50, name: "Nihon Lobster", description: "Traditional Japanese-style lobster brushed with a glossy savoury soy and mirin glaze." },
  ] },
  { title: "Sides", dishes: [
    { price: 5, name: "NIPO House Seasoned Fries" },
    { price: 5, name: "Buttered Mash" },
    { price: 6, name: "Creamed Japanese Spinach" },
    { price: 5, name: "Chilli & Sesame Tenderstem Broccoli" },
    { price: 5, name: "Charred Corn, Cherry Tomato & Jalapeño Salad" },
    { price: 6, name: "Garlic & Wild Mushroom Cream" },
    { price: 4, name: "Asian Slaw" },
    { price: 4, name: "NIPO Salad" },
    { price: 6, name: "Tempura Vegetables" },
    { price: 4, name: "Steamed Rice" },
    { price: 4, name: "Fried Rice" },
    { price: 4, name: "Ginger Rice" },
  ] },
  { title: "Premium side", dishes: [
    { price: 16, name: "Lobster Mash" },
  ] },
  { title: "Sauces", dishes: [
    { price: 4, name: "Peppercorn" },
    { price: 4, name: "Miso Hollandaise" },
    { price: 4, name: "Chimichurri" },
    { price: 4, name: "Jus" },
    { price: 4, name: "Confit Garlic Cream" },
    { price: 4, name: "Miso Caramel" },
    { price: 4, name: "Old Bay Butter" },
    { price: 4, name: "Tonkatsu" },
    { price: 4, name: "Ponzu" },
  ] },
  { title: "Plant-led small plates", note: "Vegetarian & vegan. Plant-led plates, crafted with the same NIPO precision.", dishes: [
    { price: 8, name: "Yuzu & Squash Moqueca", details: "VG", description: "Kabocha and tofu gently simmered in a fragrant Brazilian broth of tomato, bell peppers, garlic, lime, paprika, cayenne and coriander." },
    { price: 8, name: "Spiced Mango", details: "V", description: "Charred sweet mango with togarashi, creamy coconut, pickled shallots, kombu oil and micro coriander." },
    { price: 9, name: "Nigiri Vegetarian Selection", details: "VG", description: "Four pieces of nigiri with avocado, inari, tamago and roasted peppers." },
    { price: 8, name: "Blue Matcha Garden Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
  ] },
  { title: "Plant-led mains", dishes: [
    { price: 14, name: "NIPO Wok Noodles", details: "VG", description: "Fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
    { price: 11, name: "Grilled Watermelon & Tofu", details: "VG", description: "Compressed and grilled watermelon with tofu, crisp onion, pickled shallots, silky avocado purée, dressed leaves and delicate micro herbs." },
  ] },
  { title: "To finish", note: "Desserts, hand-finished & freshly made in-house.", dishes: [
    { price: 9, name: "Chocolate Fondant w/ Miso Caramel", description: "Warm chocolate fondant with a molten centre, salted miso caramel and house-made vanilla ice cream." },
    { price: 9, name: "NIPO Berry Fusion", details: "GF", description: "Juicy blueberries, raspberries and blackberries with silky dark chocolate ganache, guava gel and sesame crunch. (Vegan option available.)" },
    { price: 9, name: "Passion Fruit Pavlova", details: "GF", description: "Crisp-soft meringue with light cream and vibrant Brazilian passion fruit." },
    { price: 9, name: "Matcha Cheesecake", description: "Matcha cheesecake with delicate white chocolate accents and yuzu gel." },
    { price: 9, name: "Banana & Doce de Leite", description: "Brûléed banana with coconut & white chocolate crumble, rich dulce de leche and house-made vanilla ice cream." },
    { price: 7.5, name: "NIPO House-Made Ice Cream", details: "GF", description: "Smooth house-made vanilla and spiced chocolate ice creams." },
  ] },
];

// The separate dessert PDF matches the final section of the main menu.
export const dessertSections: MenuSection[] = mainSections.filter(section => section.title === "To finish");

export const formatMenuPrice = (price: number) => `${Number.isInteger(price) ? price : price.toFixed(2)}`;
