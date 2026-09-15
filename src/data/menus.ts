export const menuLinks = [
  { title: "Main Menu", description: "Sushi, small plates & the robata", href: "#sample-food", photoId: "salmon-sushi", pdf: false },
  { title: "Drinks", description: "Cocktails, sake & spirits", href: "/menus/nipo-drinks.pdf", photoId: "botanical-cocktail", pdf: true },
  { title: "Wine", description: "A bottle for the table", href: "/menus/nipo-wine.pdf", photoId: "steak-salad", pdf: true },
];
type MenuDish = {
  name: string;
  details?: string;
  description?: string;
};

type MenuSection = {
  title: string;
  note?: string;
  dishes: MenuDish[];
};

export const sampleSections: MenuSection[] = [
  { title: "Small plates", dishes: [
    { name: "Oysters", description: "Three raw oysters with nam jim, or three tempura oysters with dill and oyster emulsion." },
    { name: "Fillet Tataki", description: "Lightly seared centre-cut beef fillet with ponzu, chilli, sesame and spring onion." },
    { name: "Tuna Crispy Rice", details: "3 pcs", description: "Sesame-seared tuna on crisp rice with jalapeño and zesty yuzu mayonnaise." },
    { name: "NIPO Beef Gyoza", details: "4 pcs", description: "Steamed gyoza dumplings filled with tender overnight-braised beef. Served with chilli & soy dip." },
    { name: "Black Tiger Prawn Tempura", description: "Crisp black tiger prawns with creamy togarashi mayonnaise and Japanese tempura sauce." },
    { name: "Atum & Salmão NIPO", description: "Fresh tuna and salmon tartare with creamy avocado, nikiri and crisp lotus root." },
    { name: "Chicken Yakitori", details: "2 pcs", description: "Tender grilled chicken thigh skewers glazed with sweet-savoury yakitori sauce. Served with kimchi." },
    { name: "Croquete de Costela", details: "3 pcs", description: "Rich braised short rib croquettes with tonkatsu, creamy kewpie mayonnaise and green onion." },
    { name: "Hot Honey & Chilli Pork", details: "4 pcs", description: "Tender slow-cooked pork glazed with sweet, fiery hot honey and chilli." },
    { name: "Duck Spring Roll", details: "2 pcs", description: "Crisp shredded duck spring rolls with a rich tonkatsu dipping sauce." },
  ] },
  { title: "Sushi fusion", note: "Made to share. All served with wasabi, pickled ginger and soy. Rolls and nigiri selections are four pieces.", dishes: [
    { name: "Fillet Fire Roll", description: "Flame-seared beef fillet, avocado, crisp onion, chimichurri and mayonnaise." },
    { name: "NIPO Tiger Roll", description: "Crisp tempura tiger king prawn, avocado, green tobiko and luxurious truffle mayo." },
    { name: "São Paulo Roll", description: "Salmon, cream cheese and avocado, golden crisp shallots, sweet soy drizzle." },
    { name: "Lobster Dragon Roll", description: "Lobster, avocado, yuzu mayonnaise and tobiko." },
    { name: "Salmon Samba Roll", description: "Fresh salmon and mango with chilli, lime, coriander and toasted sesame." },
    { name: "Trio Fish Mosaic", description: "Delicate trio of salmon, black cod and tuna, with pickled daikon and cucumber." },
    { name: "Steak Nigiri", description: "Tender beef fillet nigiri, chimichurri, togarashi mayonnaise, wasabi mayonnaise and bonito flakes." },
    { name: "Blue Matcha Garden Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
    { name: "Tuna Sashimi", description: "Five delicate slices of fresh raw tuna." },
    { name: "Salmon Sashimi", description: "Five delicate slices of fresh raw salmon." },
  ] },
  { title: "From the fire", note: "Robata grilled steaks. Served with Maldon salt, wasabi, house seasoned fries, NIPO salad & ginger rice.", dishes: [
    { name: "Ribeye Robata", details: "10 oz", description: "Deeply marbled ribeye with a rich, yielding texture." },
    { name: "Fillet Mignon Robata", details: "8 oz", description: "Exceptionally tender, lean fillet with a delicate texture." },
    { name: "Sirloin Steak", details: "10 oz", description: "Well-marbled sirloin with a generous outer edge of fat." },
    { name: "A5 Wagyu Sirloin", details: "4 oz", description: "Full-blood A5 Grade 11 Wagyu, among the world’s most prized beef, celebrated for extraordinary marbling and buttery tenderness." },
    { name: "NIPO F1 Sirloin", details: "8 oz", description: "Black Angus × Wagyu crossbreed, combining tenderness and marbling." },
  ] },
  { title: "To share", dishes: [
    { name: "Côte de Boeuf", details: "Approx. 900g - 1kg", description: "Carved bone-in ribeye with two sides and two sauces of your choice." },
    { name: "Wagyu F1 Picanha", details: "Approx. 800g - 1kg", description: "Grilled Wagyu F1 picanha with two sides and two sauces of your choice." },
  ] },
  { title: "Fire & feast", note: "Large plates & sharing selections. Please note fish dishes may contain bones.", dishes: [
    { name: "Costela NIPO", description: "Tender slow-cooked beef rib with silky creamy mandioca and sharp pickled shallot." },
    { name: "Lamb Cutlets", description: "Charred lamb cutlets with Brazilian-Japanese herb miso chimichurri." },
    { name: "Miso Kuro Cod", description: "Premium, delicate black cod caramelized with a rich, sweet Japanese miso glaze, elevated by vibrant pickled ginger and nutty sesame notes." },
    { name: "Mahi Mahi Moqueca", description: "Mahi Mahi fillet simmered in an aromatic Brazilian stew of tomato, bell peppers, garlic, lime, paprika, cayenne and coriander." },
    { name: "Slow-Cooked Lamb Shank", description: "Slow-cooked lamb, silky yuca aligot and crisp onion." },
    { name: "NIPO Chicken Wok Noodles", description: "Chargrilled chicken, fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
    { name: "Nihon Lobster", description: "Traditional Japanese-style lobster brushed with a glossy savoury soy and mirin glaze." },
  ] },
  { title: "Sides", dishes: [
    { name: "NIPO House Seasoned Fries" },
    { name: "Buttered Mash" },
    { name: "Creamed Japanese Spinach" },
    { name: "Chilli & Sesame Tenderstem Broccoli" },
    { name: "Charred Corn, Cherry Tomato & Jalapeño Salad" },
    { name: "Garlic & Wild Mushroom Cream" },
    { name: "Asian Slaw" },
    { name: "NIPO Salad" },
    { name: "Tempura Vegetables" },
    { name: "Steamed Rice" },
    { name: "Fried Rice" },
    { name: "Ginger Rice" },
  ] },
  { title: "Premium side", dishes: [
    { name: "Lobster Mash" },
  ] },
  { title: "Sauces", dishes: [
    { name: "Peppercorn" },
    { name: "Miso Hollandaise" },
    { name: "Chimichurri" },
    { name: "Jus" },
    { name: "Confit Garlic Cream" },
    { name: "Miso Caramel" },
    { name: "Old Bay Butter" },
    { name: "Tonkatsu" },
    { name: "Ponzu" },
  ] },
  { title: "Plant-led small plates", note: "Vegetarian & vegan. Plant-led plates, crafted with the same NIPO precision.", dishes: [
    { name: "Yuzu & Squash Moqueca", details: "VG", description: "Kabocha and tofu gently simmered in a fragrant Brazilian broth of tomato, bell peppers, garlic, lime, paprika, cayenne and coriander." },
    { name: "Spiced Mango", details: "V", description: "Charred sweet mango with togarashi, creamy coconut, pickled shallots, kombu oil and micro coriander." },
    { name: "Nigiri Vegetarian Selection", details: "VG", description: "Four pieces of nigiri with avocado, inari, tamago and roasted peppers." },
    { name: "Blue Matcha Garden Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
  ] },
  { title: "Plant-led mains", dishes: [
    { name: "NIPO Wok Noodles", details: "VG", description: "Fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
    { name: "Grilled Watermelon & Tofu", details: "VG", description: "Compressed and grilled watermelon with tofu, crisp onion, pickled shallots, silky avocado purée, dressed leaves and delicate micro herbs." },
  ] },
  { title: "To finish", note: "Desserts, hand-finished & freshly made in-house.", dishes: [
    { name: "Chocolate Fondant w/ Miso Caramel", description: "Warm chocolate fondant with a molten centre, salted miso caramel and house-made vanilla ice cream." },
    { name: "NIPO Berry Fusion", details: "GF", description: "Juicy blueberries, raspberries and blackberries with silky dark chocolate ganache, guava gel and sesame crunch. (Vegan option available.)" },
    { name: "Passion Fruit Pavlova", details: "GF", description: "Crisp-soft meringue with light cream and vibrant Brazilian passion fruit." },
    { name: "Matcha Cheesecake", description: "Matcha cheesecake with delicate white chocolate accents and yuzu gel." },
    { name: "Banana & Doce de Leite", description: "Brûléed banana with coconut & white chocolate crumble, rich dulce de leche and house-made vanilla ice cream." },
    { name: "NIPO House-Made Ice Cream", details: "GF", description: "Smooth house-made vanilla and spiced chocolate ice creams." },
  ] },
];
