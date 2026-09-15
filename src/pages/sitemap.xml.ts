import type { APIRoute } from "astro";
import { indexablePages, siteNoIndex } from "../config/seo";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://nipobraza.co.uk");
  const entries = (siteNoIndex ? [] : indexablePages)
    .map(({ path }) => `  <url><loc>${new URL(path, origin).href.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
};
