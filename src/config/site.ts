export type SocialPlatform = "Facebook" | "Instagram" | "TikTok";
export interface SocialLink { label: SocialPlatform; url?: string }
export interface SiteConfig {
  name: string; tagline: string; locationLabel: string; canonicalUrl: string; bookingUrl: string;
  opening: { status: "pre-opening" | "open"; date: string; label: string };
  address: { street: string; city: string; postcode: string; directionsUrl: string; mapEmbedUrl: string };
  telephone: string; telephoneDisplay: string; email: string;
  hours: { days: string[]; opens: string; closes: string; label: string }[];
  navigation: { label: string; href: string }[];
  hero: { mode: "slideshow" | "video"; slideIds: string[]; interval: number };
  video: { src?: string; poster: string };
  privacyContact?: string; socialLinks: SocialLink[];
}
const cleanUrl = (value?: string) => value?.trim() || undefined;
export const siteConfig: SiteConfig = {
  name: "NIPO", tagline: "Japanese Precision. Brazilian Fire.", locationLabel: "Newcastle Quayside",
  canonicalUrl: __NIPO_SITE_URL__,
  bookingUrl: "https://www.sevenrooms.com/app/reservations/nipo/create/search/",
  opening: { status: "pre-opening", date: "2026-09-23", label: "23 September 2026" },
  telephone: "+441912221122", telephoneDisplay: "0191 222 1122", email: "newcastle@nipobraza.co.uk",
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "12:00", closes: "21:00", label: "Monday–Thursday, 12 noon–9pm" },
    { days: ["Friday", "Saturday"], opens: "12:00", closes: "22:00", label: "Friday–Saturday, 12 noon–10pm" },
    { days: ["Sunday"], opens: "12:00", closes: "20:00", label: "Sunday, 12 noon–8pm" },
  ],
  address: { street: "95 Quayside", city: "Newcastle upon Tyne", postcode: "NE1 3DH",
    directionsUrl: "https://maps.app.goo.gl/GUKfBrYgQ4VW4P6q8",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8588.484834923209!2d-1.6079837!3d54.9684935!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487e711480fed221%3A0x2d848d4cb06d7693!2sNIPO%20Japanese%20Precision.%20Brazilian%20Fire!5e1!3m2!1sen!2suk!4v1789640284849!5m2!1sen!2suk" },
  navigation: [
    { label: "Concept", href: "/concept/" }, { label: "Menus", href: "/menus/" },
    { label: "Gallery", href: "/gallery/" }, { label: "Contact", href: "/contact/" },
  ],
  hero: { mode: "slideshow", slideIds: ["salmon-sushi", "steak-salad", "botanical-cocktail"], interval: 7000 },
  video: { src: cleanUrl(import.meta.env.PUBLIC_VIMEO_VIDEO_URL), poster: "/images/social-card.png" },
  privacyContact: cleanUrl(import.meta.env.PUBLIC_PRIVACY_EMAIL) || "info@nipobraza.co.uk",
  socialLinks: [
    { label: "Facebook", url: "https://www.facebook.com/nipobraza" },
    { label: "Instagram", url: "https://www.instagram.com/nipobraza/" },
    { label: "TikTok", url: cleanUrl(import.meta.env.PUBLIC_TIKTOK_URL) },
  ],
};
export const isPreOpening = siteConfig.opening.status === "pre-opening";
export const openingLine = isPreOpening ? "Opening " + siteConfig.opening.label : "Welcome to NIPO";
export const vipCopy = isPreOpening
  ? "Join us for opening news, first looks and a taste of what’s coming to the Quayside."
  : "Join us for new dishes, seasonal moments and news from NIPO.";
