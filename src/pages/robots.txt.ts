import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://nipobraza.co.uk");
  const sitemap = new URL("/sitemap.xml", origin);

  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`,
    {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    },
  );
};
