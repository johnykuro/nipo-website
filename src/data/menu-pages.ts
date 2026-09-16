import { mainSections, dessertSections } from "./menus";
import { drinksSections } from "./drinks";
import { wineSections } from "./wine";

export const menuPages = [
  { path: "/menus/", id: "main-menu", title: "Main Menu", sections: mainSections },
  { path: "/menus/dessert/", id: "dessert-menu", title: "Dessert Menu", sections: dessertSections },
  { path: "/menus/drinks/", id: "drinks-menu", title: "Drinks Menu", sections: drinksSections },
  { path: "/menus/wine/", id: "wine-menu", title: "Wine List", sections: wineSections },
];
