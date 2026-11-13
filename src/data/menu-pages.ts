import { setSections } from "./set-menu";
import { childrensSections } from "./childrens-menu";
import { mainSections, dessertSections, steakSections } from "./menus";
import { drinksSections } from "./drinks";
import { wineSections } from "./wine";
import { festiveSections } from "./festive-menu";

export const menuPages = [
  { path: "/christmas/", id: "festive-menu", title: "Festive Set Menu", sections: festiveSections },
  { path: "/menus/childrens/", id: "childrens-menu", title: "Children’s Menu", sections: childrensSections },
  { path: "/menus/set/", id: "set-menu", title: "Set Menu", sections: setSections },
  { path: "/menus/", id: "main-menu", title: "À La Carte", sections: mainSections },
  { path: "/menus/steaks/", id: "steaks-menu", title: "Steaks Menu", sections: steakSections },
  { path: "/menus/dessert/", id: "dessert-menu", title: "Dessert Menu", sections: dessertSections },
  { path: "/menus/drinks/", id: "drinks-menu", title: "Drinks Menu", sections: drinksSections },
  { path: "/menus/wine/", id: "wine-menu", title: "Wine List", sections: wineSections },
];
