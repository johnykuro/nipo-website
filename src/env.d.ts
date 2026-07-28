/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_VIMEO_VIDEO_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_FACEBOOK_URL?: string;
  readonly PUBLIC_INSTAGRAM_URL?: string;
  readonly PUBLIC_TIKTOK_URL?: string;
  readonly PUBLIC_PRIVACY_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
