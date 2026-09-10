import type { SiteConfig } from "./site";

export const homeTitle = "NIPO | Japanese-Brazilian Restaurant Newcastle";
export const homeDescription =
  "NIPO opens 23rd September at 95 Quayside, Newcastle upon Tyne. Discover Japanese-Brazilian dining, sushi, robata and fire-cooked signatures.";

export const faqItems = [
  {
    question: "What is NIPO?",
    answer:
      "NIPO is a Japanese-Brazilian restaurant opening on Newcastle Quayside on 23rd September, shaped by Japanese precision, Brazilian fire and warm hospitality.",
  },
  {
    question: "Where is NIPO opening?",
    answer:
      "Find NIPO at 95 Quayside, Newcastle upon Tyne NE1 3DH, in the former Tomahawk Steakhouse location.",
  },
  {
    question: "What food will NIPO serve?",
    answer:
      "The menu will bring together sushi, robata-style cooking, fire-cooked picanha and Japanese-Brazilian signatures designed for sharing.",
  },
  {
    question: "When will NIPO open?",
    answer:
      "NIPO opens on 23rd September. Join the VIP list for first looks and updates ahead of opening.",
  },
] as const;

export function buildHomeStructuredData(config: SiteConfig, site: URL) {
  const homeUrl = new URL("/", site).href;
  const logoUrl = new URL("/brand/nipo-logo.svg", site).href;
  const imageUrl = new URL("/images/social-card.png", site).href;
  const sameAs = config.socialLinks.flatMap((social) =>
    social.url ? [social.url] : [],
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        url: homeUrl,
        name: config.name,
        alternateName: "NIPO Newcastle",
        inLanguage: "en-GB",
        publisher: { "@id": `${homeUrl}#restaurant` },
      },
      {
        "@type": "Restaurant",
        "@id": `${homeUrl}#restaurant`,
        name: config.name,
        url: homeUrl,
        logo: logoUrl,
        image: imageUrl,
        description: homeDescription,
        slogan: config.tagline,
        servesCuisine: [
          "Japanese-Brazilian",
          "Japanese",
          "Brazilian",
          "Sushi",
          "Robata",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "95 Quayside",
          addressLocality: "Newcastle upon Tyne",
          addressRegion: "Tyne and Wear",
          postalCode: "NE1 3DH",
          addressCountry: "GB",
        },
        areaServed: {
          "@type": "City",
          name: "Newcastle upon Tyne",
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: homeTitle,
        description: homeDescription,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${homeUrl}#website` },
        about: { "@id": `${homeUrl}#restaurant` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${homeUrl}#faq`,
        isPartOf: { "@id": `${homeUrl}#webpage` },
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
