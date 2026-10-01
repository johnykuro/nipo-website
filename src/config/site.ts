export type SocialPlatform = "Facebook" | "Instagram" | "TikTok";
export interface SocialLink { label: SocialPlatform; url?: string }
export interface SiteConfig {
  name: string; tagline: string; canonicalUrl: string;
  navigation: { label: string; href: string }[];
  hero: { mode: "slideshow" | "video"; slideIds: string[]; interval: number };
  video: { src?: string; poster: string };
  privacyContact?: string; socialLinks: SocialLink[];
}
const cleanUrl = (value?: string) => value?.trim() || undefined;
export const siteConfig: SiteConfig = {
  name: "NIPO", tagline: "Japanese Precision. Brazilian Fire.",
  canonicalUrl: __NIPO_SITE_URL__,
  navigation: [
    { label: "Concept", href: "/concept/" }, { label: "Menus", href: "/menus/" },
    { label: "Gallery", href: "/gallery/" }, { label: "Locations", href: "/locations/" },
  ],
  hero: { mode: "slideshow", slideIds: ["hero-sushi-table", "hero-sliced-steak", "hero-sushi-chopsticks", "hero-braised-shank", "hero-lamb-cutlets"], interval: 7000 },
  video: { src: cleanUrl(import.meta.env.PUBLIC_VIMEO_VIDEO_URL), poster: "/images/social-card.png" },
  privacyContact: cleanUrl(import.meta.env.PUBLIC_PRIVACY_EMAIL) || "info@nipobraza.co.uk",
  socialLinks: [
    { label: "Facebook", url: "https://www.facebook.com/nipobraza" },
    { label: "Instagram", url: "https://www.instagram.com/nipobraza/" },
    { label: "TikTok", url: cleanUrl(import.meta.env.PUBLIC_TIKTOK_URL) },
  ],
};
export const newsletterCopy = "Sign up to our newsletter for new dishes, seasonal menus and news from NIPO.";
