export type SocialPlatform = "Facebook" | "Instagram" | "TikTok";

export interface SocialLink {
  label: SocialPlatform;
  url?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  locationLabel: string;
  canonicalUrl: string;
  video: {
    src?: string;
    poster: string;
  };
  privacyContact?: string;
  socialLinks: SocialLink[];
}

const cleanUrl = (value?: string): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const siteConfig: SiteConfig = {
  name: "NIPO",
  tagline: "Japanese Precision. Brazilian Fire.",
  locationLabel: "Newcastle Quayside",
  canonicalUrl: import.meta.env.PUBLIC_SITE_URL ?? "https://nipo.example",
  video: {
    src:
      cleanUrl(import.meta.env.PUBLIC_VIMEO_VIDEO_URL) ??
      "https://player.vimeo.com/progressive_redirect/playback/1215173947/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=e5191c7f23e58d8bab39b943c669fc9e01dc85185f9ecc2717a08072097a5be4",
    poster: "/images/hero-poster.svg",
  },
  privacyContact: cleanUrl(import.meta.env.PUBLIC_PRIVACY_EMAIL),
  socialLinks: [
    { label: "Facebook", url: cleanUrl(import.meta.env.PUBLIC_FACEBOOK_URL) },
    { label: "Instagram", url: cleanUrl(import.meta.env.PUBLIC_INSTAGRAM_URL) },
    { label: "TikTok", url: cleanUrl(import.meta.env.PUBLIC_TIKTOK_URL) },
  ],
};
