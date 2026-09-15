/** Check the actual built HTML, XML, links and social image before deployment. */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import sharp from "sharp";
import { loadEnv } from "vite";
import { deploymentConfig } from "./deployment-config.mjs";

const root = resolve("dist");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map((m) => [m[1], decode(m[2] ?? m[3] ?? m[4] ?? "")]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map((m) => attributes(m[0]));
const meta = (html, name) => {
  const values = tags(html, "meta").filter((tag) => tag.name === name || tag.property === name);
  assert.equal(values.length, 1, `Exactly one ${name}`);
  return values[0].content;
};
const files = readdirSync(root, { recursive: true }).filter((file) => String(file).endsWith(".html"));
const home = read("index.html");
const preview = meta(home, "robots").includes("noindex");
const expected = deploymentConfig({ ...loadEnv(process.env.NODE_ENV || "production", process.cwd(), ""), ...process.env });
assert.equal(preview, expected.noIndex, "Built indexing policy matches deployment context");
if (process.argv.includes("--expect-preview")) assert.equal(preview, true, "Expected a preview build");
if (process.argv.includes("--expect-production")) assert.equal(preview, false, "Expected a production build");
const origin = new URL(meta(home, "og:url")).origin;
assert.equal(origin, expected.site, "Built canonical origin matches deployment configuration");
const titles = new Set(), descriptions = new Set(), urls = [];
let localLinks = 0, menuItems = 0;
for (const file of files) {
  const html = read(file);
  const path = "/" + String(file).split(sep).join("/").replace(/index\.html$/, "");
  const error = path === "/404.html";
  const url = new URL(path, origin);
  assert.match(html, /<html lang="en-GB"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${path}: one main landmark`);
  const titleMatches = [...html.matchAll(/<title>(.*?)<\/title>/gs)];
  assert.equal(titleMatches.length, 1);
  const title = decode(titleMatches[0][1]);
  assert(title.length > 0 && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  const description = meta(html, "description");
  assert(description && !descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  assert.equal(meta(html, "robots").includes("noindex"), error || preview, `${path}: indexing`);
  const canonicals = tags(html, "link").filter((tag) => tag.rel === "canonical");
  assert.equal(canonicals.length, error ? 0 : 1, `${path}: canonical count`);
  if (!error) {
    assert.equal(canonicals[0].href, url.href, `${path}: canonical URL`);
    assert.equal(meta(html, "og:url"), url.href);
    assert.equal(meta(html, "og:title"), title);
    assert.equal(meta(html, "og:description"), description);
    assert.equal(meta(html, "twitter:card"), "summary_large_image");
    assert.equal(meta(html, "twitter:image"), meta(html, "og:image"));
    const image = new URL(meta(html, "og:image"));
    assert.equal(image.origin, origin);
    assert(existsSync(resolve(root, "." + image.pathname)), `${path}: social image exists`);
    urls.push(url.href);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, error ? 0 : 1, `${path}: JSON-LD count`);
  if (!error) {
    const data = JSON.parse(scripts[0][1]);
    assert.equal(data["@context"], "https://schema.org");
    const graph = data["@graph"];
    const ids = graph.map((node) => node["@id"]);
    assert.equal(new Set(ids).size, ids.length, `${path}: unique entity IDs`);
    const restaurant = graph.find((node) => node["@type"] === "Restaurant");
    assert(restaurant?.name && restaurant.address?.streetAddress && restaurant.address?.postalCode);
    assert.equal(restaurant["@id"], origin + "/#restaurant");
    assert.equal(restaurant.hasMenu, origin + "/menus/");
    const page = graph.find((node) => node["@id"] === url.href + "#webpage");
    assert.equal(page.name, title);
    assert.equal(page.description, description);
    if (path !== "/") {
      const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");
      assert.deepEqual(crumbs.itemListElement.map((item) => item.position), [1, 2]);
      assert.equal(crumbs.itemListElement[1].item, url.href);
    }
    const visible = decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
    if (path === "/contact/") for (const question of page.mainEntity) {
      assert(visible.includes(question.name), `Visible FAQ: ${question.name}`);
      assert(visible.includes(question.acceptedAnswer.text), `Visible answer: ${question.name}`);
    }
    if (path === "/menus/") {
      const menu = graph.find((node) => node["@id"] === url.href + "#sample-food");
      assert.match(menu.description, /subject to change/);
      for (const section of menu.hasMenuSection) for (const dish of section.hasMenuItem) {
        assert(visible.includes(dish.name), `Visible dish: ${dish.name}`);
        if (dish.description) assert(visible.includes(dish.description), `Visible description: ${dish.name}`);
        assert(!dish.offers && !dish.suitableForDiet, "Do not invent prices or dietary guarantees");
        menuItems++;
      }
      assert.equal(menuItems, (html.match(/class="menu-dish"/g) || []).length);
    }
  }
  for (const tag of [...tags(html, "a"), ...tags(html, "link"), ...tags(html, "img"), ...tags(html, "script")]) {
    const value = tag.href || tag.src;
    if (!value || /^(mailto:|tel:|data:)/.test(value)) continue;
    const target = new URL(value, url);
    if (target.origin !== origin || target.pathname.startsWith("/api/")) continue;
    let targetFile = resolve(root, "." + decodeURIComponent(target.pathname));
    if (target.pathname.endsWith("/")) targetFile = resolve(targetFile, "index.html");
    assert(!relative(root, targetFile).startsWith(".."));
    assert(existsSync(targetFile), `${path}: missing local resource ${value}`);
    if (target.hash && targetFile.endsWith(".html")) {
      const targetHtml = readFileSync(targetFile, "utf8");
      assert(tags(targetHtml, "[a-zA-Z][a-zA-Z0-9]*").some((item) => item.id === decodeURIComponent(target.hash.slice(1))), `${path}: missing anchor ${value}`);
    }
    localLinks++;
  }
  for (const img of tags(html, "img")) assert("alt" in img, `${path}: image alternative text`);
}
const sitemap = read("sitemap.xml");
assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
assert.deepEqual(listed.sort(), preview ? [] : urls.sort(), "Sitemap equals canonical indexable pages");
const robots = read("robots.txt");
assert.match(robots, /User-agent: \*\nAllow: \/\nDisallow: \/api\//);
assert.equal(robots.includes(`Sitemap: ${origin}/sitemap.xml`), !preview);
const headers = read("_headers");
assert.match(headers, /\/_astro\/\*/);
assert.equal(headers.includes("X-Robots-Tag: noindex, nofollow"), preview);
const image = await sharp(resolve(root, "images/social-card.png")).metadata();
assert.equal(image.width, 1200); assert.equal(image.height, 630);
for (const name of ["nipo-drinks.pdf", "nipo-wine.pdf"]) assert.equal(readFileSync(resolve(root, "menus", name)).subarray(0, 5).toString(), "%PDF-");
console.log(`SEO verification passed: ${urls.length} pages, ${localLinks} local links/assets, ${menuItems} menu items; ${preview ? "preview noindex" : "production indexable"}.`);
