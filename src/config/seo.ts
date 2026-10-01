import type { SiteConfig } from "./site";
import { locations, newcastle } from "./locations";
import { newcastleFaqs, harrogateFaqs } from "./faqs";
import { menuLinks } from "../data/menus";
import { menuPages } from "../data/menu-pages";
export const indexablePages = [
  { path: "/", label: "Home", type: "WebPage" },
  { path: "/concept/", label: "Concept", type: "AboutPage" },
  { path: "/menus/", label: "Menus", type: "CollectionPage" },
  { path: "/menus/dessert/", label: "Dessert menu", type: "WebPage" },
  { path: "/menus/drinks/", label: "Drinks menu", type: "WebPage" },
  { path: "/menus/wine/", label: "Wine list", type: "WebPage" },
  { path: "/gallery/", label: "Gallery", type: "CollectionPage" },
  { path: "/locations/", label: "Locations", type: "CollectionPage" },
  { path: "/locations/newcastle/", label: "Newcastle Quayside", type: "WebPage" },
  { path: "/locations/harrogate/", label: "Harrogate", type: "WebPage" },
  { path: "/privacy/", label: "Privacy policy", type: "WebPage" },
] as const;
export const siteNoIndex = __NIPO_NOINDEX__;

export const homeTitle = "NIPO | Japanese-Brazilian Dining in Newcastle & Harrogate";
export const homeDescription = "Japanese precision. Brazilian fire. Discover NIPO on Newcastle Quayside and our new Japanese-Brazilian steakhouse coming soon to Harrogate.";

export function buildPageStructuredData(config: SiteConfig, path: string, title: string, description: string) {
  const page = indexablePages.find(entry => entry.path === path);
  if (!page) return undefined;
  const site = new URL(config.canonicalUrl);
  const home = new URL("/", site).href;
  const url = new URL(path, site).href;
  const location = locations.find(place => place.path === path) ?? (path.startsWith("/menus/") ? newcastle : undefined);
  const restaurantId = location ? new URL(location.path, site).href + "#restaurant" : undefined;
  const faqItems = path === "/locations/newcastle/" ? newcastleFaqs : path === "/locations/harrogate/" ? harrogateFaqs : undefined;
  const menuPage = menuPages.find(menu => menu.path === path);
  const menuSections = menuPage?.sections;
  const menuId = menuPage?.id;
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": home + "#organization", name: config.name, url: home,
      logo: new URL("/brand/nipo-logo.svg", site).href, slogan: config.tagline,
      sameAs: config.socialLinks.flatMap(item => item.url ? [item.url] : []),
    },
    { "@type": "WebSite", "@id": home + "#website", url: home, name: config.name,
      publisher: { "@id": home + "#organization" }, inLanguage: "en-GB" },
    { "@type": faqItems ? [page.type, "FAQPage"] : page.type,
      "@id": url + "#webpage", url, name: title, description, inLanguage: "en-GB",
      isPartOf: { "@id": home + "#website" }, about: { "@id": restaurantId ?? home + "#organization" },
      ...(path !== "/" ? { breadcrumb: { "@id": url + "#breadcrumb" } } : {}),
      ...(faqItems ? { mainEntity: faqItems.map(item => ({ "@type": "Question", name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer } }))
      } : menuSections ? { mainEntity: { "@id": url + "#" + menuId } } : {}),
    },
  ];
  if (location) graph.push({
    "@type": "Restaurant", "@id": restaurantId, name: "NIPO " + location.name,
    url: new URL(location.path, site).href, parentOrganization: { "@id": home + "#organization" },
    image: new URL(location.id === "harrogate" ? "/images/harrogate-social.png" : "/images/social-card.png", site).href,
    description: location.id === "harrogate" ? "A Japanese-Brazilian steakhouse coming soon to Parliament St, Harrogate. Opening date to be announced." : "Japanese-Brazilian dining, sushi and robata on Newcastle Quayside.",
    servesCuisine: ["Japanese-Brazilian", "Japanese", "Brazilian"],
    address: { "@type": "PostalAddress", streetAddress: location.address.street,
      addressLocality: location.address.city, postalCode: location.address.postcode, addressCountry: "GB" },
    ...(location.id === "newcastle" ? {
      hasMenu: new URL("/menus/", site).href, acceptsReservations: newcastle.bookingUrl,
      hasMap: newcastle.address.directionsUrl, telephone: newcastle.telephone, email: newcastle.email,
      openingHoursSpecification: newcastle.hours.map(hours => ({ "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map(day => "https://schema.org/" + day), opens: hours.opens, closes: hours.closes,
      })),
    } : {}),
  });
  if (path !== "/") {
    const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: home }];
    if (path.startsWith("/locations/") && path !== "/locations/") crumbs.push({ "@type": "ListItem", position: 2, name: "Locations", item: new URL("/locations/", site).href });
    crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: page.label, item: url });
    graph.push({ "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: crumbs });
  }
  if (menuSections) {
    graph.push({
      "@type": "Menu", "@id": url + "#" + menuId, url: url + "#" + menuId,
      name: menuPage!.title, description,
      inLanguage: "en-GB",
      hasMenuSection: menuSections.map((section) => ({
        "@type": "MenuSection", name: section.title,
        ...(section.note ? { description: section.note } : {}),
        hasMenuItem: section.dishes.map((dish) => ({
          "@type": "MenuItem", name: dish.name,
          offers: dish.servings
            ? dish.servings.map((serving) => ({ "@type": "Offer", name: serving.label, price: serving.price.toFixed(2), priceCurrency: "GBP" }))
            : { "@type": "Offer", price: dish.price.toFixed(2), priceCurrency: "GBP" },
          ...(dish.description ? { description: dish.description } : {}),
        })),
      })),
    });
    for (const menu of menuLinks) graph.push({
      "@type": "Menu", "@id": new URL(menu.pdfHref, site).href,
      url: new URL(menu.pdfHref, site).href, name: menu.title, description: menu.description,
      inLanguage: "en-GB",
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
