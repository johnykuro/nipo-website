import type { MenuSection } from "./menus";

// Transcribed from the supplied NIPO-festive-set-menu-WEB.pdf, including its printed markers.
// Course combinations and service dates are not specified in the source.
export const festiveSections: MenuSection[] = [
  { title: "Sushi appetizer", dishes: [
    { name: "Natal Duck Roll", description: "Crispy confit duck, cucumber and pickled mooli, topped with roast duck, orange-miso glaze, cranberry hoisin & crispy sage.", festiveExclusive: true },
    { name: "Blue Matcha Roll", details: "VG", description: "Vibrant blue matcha sushi rice with beetroot, carrot, cucumber and mango." },
  ] },
  { title: "Starter", dishes: [
    { name: "Tuna & Unagi Crispy Rice", description: "Fresh tuna tartare, zesty lime and sriracha aioli on golden crispy rice, finished with rich, caramelised eel. A must try!", festiveExclusive: true },
    { name: "Croquete de Costela", description: "Rich braised short rib croquettes with tonkatsu, creamy kewpie mayonnaise and green onion." },
    { name: "Duck Spring Rolls", description: "Crisp shredded duck spring rolls with a rich tonkatsu dipping sauce." },
    { name: "Hot Honey & Chilli Pork", description: "Tender slow-cooked pork glazed with sweet, fiery hot honey and chilli." },
    { name: "Soft-Shell Crab Tempura", description: "Delicately fried soft-shell crab in golden tempura batter, finished with togarashi, zesty yuzu mayonnaise and avocado purée.", festiveExclusive: true },
    { name: "Spiced Mango", details: "V", description: "Charred sweet mango with togarashi, creamy coconut, pickled shallots, kombu oil and micro coriander." },
  ] },
  { title: "Main", dishes: [
    { name: "Miso Kuro Cod", description: "Premium, delicate black cod caramelised with a rich, sweet Japanese miso glaze, elevated by vibrant pickled ginger and nutty sesame notes. *May contain bones" },
    { name: "Fillet Mignon", description: "Exceptionally tender, lean fillet steak, robata grilled. Served with Maldon salt, wasabi, house seasoned fries." },
    { name: "Slow-Cooked Lamb Shank", description: "Tender slow-cooked lamb shank served with silky yuca aligot, a rich and creamy cassava mash, finished with golden crisp onions." },
    { name: "Grilled Watermelon & Tofu", details: "VG", description: "Compressed and grilled watermelon with tofu, crisp onion, pickled shallots, silky avocado purée, dressed leaves and delicate micro herbs." },
    { name: "Wok Noodles", details: "VG", description: "Fried noodles, hearts of palm, couve and sweetcorn in a rich yakisoba sauce." },
  ] },
  { title: "Dessert", dishes: [
    { name: "Yuzu Pistachio Panna Cotta", description: "Silky, delicately set cream infused citrus notes of Japanese yuzu, crushed pistachios, honey tuile and vibrant tropical guava gel.", festiveExclusive: true },
    { name: "NIPO Berry Fusion", description: "Juicy blueberries, raspberries and blackberries with silky dark chocolate ganache, guava gel and sesame crunch. (Vegan option available.)" },
  ] },
];
