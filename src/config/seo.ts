import { isPreOpening, siteConfig } from "./site";
import type { SiteConfig } from "./site";
import { sampleSections, menuLinks } from "../data/menus";

export const indexablePages = [
  { path: "/", label: "Home", type: "WebPage" },
  { path: "/concept/", label: "Concept", type: "AboutPage" },
  { path: "/menus/", label: "Menus", type: "CollectionPage" },
  { path: "/gallery/", label: "Gallery", type: "CollectionPage" },
  { path: "/contact/", label: "Contact", type: "ContactPage" },
  { path: "/privacy/", label: "Privacy policy", type: "WebPage" },
] as const;
export const siteNoIndex = __NIPO_NOINDEX__;
export const homeTitle = "NIPO | Japanese-Brazilian Restaurant Newcastle";
export const homeDescription = isPreOpening
  ? "NIPO opens " + siteConfig.opening.label + " at 95 Quayside, Newcastle upon Tyne. Discover sushi, robata and Japanese-Brazilian dining."
  : "Discover NIPO at 95 Quayside, Newcastle upon Tyne. Japanese-Brazilian dining, sushi, robata and fire-cooked signatures.";
export const faqItems = [
  { question: "What is NIPO?", answer: "NIPO is a Japanese-Brazilian restaurant on Newcastle Quayside, shaped by sushi craft, cooking over fire and warm hospitality." },
  { question: "Where can I find NIPO?", answer: siteConfig.address.street + ", " + siteConfig.address.city + " " + siteConfig.address.postcode + "." },
  { question: "What food will I find at NIPO?", answer: "Sushi, small plates, robata-style cooking, picanha and plant-led dishes. Explore a selection on our sample food menu while the full menu is being finalised." },
  ...(isPreOpening ? [{ question: "When does NIPO open?", answer: "NIPO opens on " + siteConfig.opening.label + ". Reservations are available now. Join our VIP list for opening news and first looks." }] : []),
  { question: "How do I book a table?", answer: "Choose Book a Table anywhere on our website to see availability and make your reservation with SevenRooms." },
  { question: "What are NIPO’s opening hours?", answer: (isPreOpening ? "From " + siteConfig.opening.label + ", " : "") + "NIPO is open: " + siteConfig.hours.map((hours) => hours.label).join("; ") + "." },
  { question: "How do I contact NIPO?", answer: "Call " + siteConfig.telephoneDisplay + " or email " + siteConfig.email + "." },
];
export function buildPageStructuredData(config: SiteConfig, path: string, title: string, description: string) {
  const page = indexablePages.find((entry) => entry.path === path);
  if (!page) return undefined;
  const site = new URL(config.canonicalUrl);
  const home = new URL("/", site).href;
  const url = new URL(path, site).href;
  const graph: Record<string, unknown>[] = [
    { "@type": "WebSite", "@id": home + "#website", url: home, name: config.name,
      publisher: { "@id": home + "#restaurant" }, inLanguage: "en-GB" },
    { "@type": "Restaurant", "@id": home + "#restaurant", name: config.name, url: home,
      image: new URL("/images/social-card.png", site).href, logo: new URL("/brand/nipo-logo.svg", site).href,
      description: homeDescription, slogan: config.tagline, servesCuisine: ["Japanese-Brazilian", "Japanese", "Brazilian"],
      hasMenu: new URL("/menus/", site).href, acceptsReservations: config.bookingUrl,
      hasMap: config.address.directionsUrl,
      telephone: config.telephone, email: config.email,
      openingHoursSpecification: config.hours.map((hours) => ({ "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map((day) => "https://schema.org/" + day),
        opens: hours.opens, closes: hours.closes, validFrom: config.opening.date,
      })),
      address: { "@type": "PostalAddress", streetAddress: config.address.street, addressLocality: config.address.city,
        postalCode: config.address.postcode, addressCountry: "GB" },
      sameAs: config.socialLinks.flatMap((item) => item.url ? [item.url] : []),
    },
    { "@type": path === "/contact/" ? [page.type, "FAQPage"] : page.type,
      "@id": url + "#webpage", url, name: title, description, inLanguage: "en-GB",
      isPartOf: { "@id": home + "#website" }, about: { "@id": home + "#restaurant" },
      ...(path !== "/" ? { breadcrumb: { "@id": url + "#breadcrumb" } } : {}),
      ...(path === "/contact/" ? {
        mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      } : path === "/menus/" ? { mainEntity: { "@id": url + "#sample-food" } } : {}),
    },
  ];
  if (path !== "/") graph.push({
    "@type": "BreadcrumbList", "@id": url + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: home },
      { "@type": "ListItem", position: 2, name: page.label, item: url },
    ],
  });
  if (path === "/menus/") {
    graph.push({
      "@type": "Menu", "@id": url + "#sample-food", url: url + "#sample-food",
      name: "Sample Main Menu", description: "Sample menu — subject to change",
      inLanguage: "en-GB",
      hasMenuSection: sampleSections.map((section) => ({
        "@type": "MenuSection", name: section.title,
        ...(section.note ? { description: section.note } : {}),
        hasMenuItem: section.dishes.map((dish) => ({
          "@type": "MenuItem", name: dish.name,
          ...(dish.description ? { description: dish.description } : {}),
        })),
      })),
    });
    for (const menu of menuLinks.filter((item) => item.pdf)) graph.push({
      "@type": "Menu", "@id": new URL(menu.href, site).href,
      url: new URL(menu.href, site).href, name: menu.title, description: menu.description,
      inLanguage: "en-GB",
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
