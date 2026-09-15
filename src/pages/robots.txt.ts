import type { APIRoute } from "astro";
import { siteNoIndex } from "../config/seo";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://nipobraza.co.uk");
  const sitemap = new URL("/sitemap.xml", origin);

  return new Response(
    // Preview pages remain crawlable so crawlers can see their noindex directive.
    `User-agent: *\nAllow: /\nDisallow: /api/\n${siteNoIndex ? "" : `\nSitemap: ${sitemap}\n`}`,
    {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    },
  );
};
