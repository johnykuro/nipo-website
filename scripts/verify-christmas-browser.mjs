/** Local Christmas regression checks. Set PLAYWRIGHT_MODULE_PATH if Playwright is bundled outside this repo. */
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4323";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("QA_ORIGIN must be local");
const output = "tmp/qa/christmas";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
const results = [];
const check = async (name, run) => { await run(); results.push(name); console.log("PASS " + name); };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.addInitScript(() => localStorage.setItem("nipo-cookie-consent", JSON.stringify({ version: 1, analytics: false, marketing: false, expires: Date.now() + 86400000 })));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const goto = path => page.goto(origin + path);
  const snowRunning = value => page.waitForFunction(value => document.querySelector("[data-christmas-page]")?.dataset.snowRunning === String(value), value);
  const settle = async () => {
    await page.evaluate(async () => { await document.fonts.ready; for (const img of document.querySelectorAll("img[src]")) { img.loading = "eager"; await img.decode(); } });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
  };
  await goto("/christmas/");
  await check("Complete shared menu, dietary labels, exclusives and venue contacts", async () => {
    assert.equal(await page.locator(".menu-dish").count(), 15);
    assert.equal(await page.locator(".menu-dish__exclusive").count(), 4);
    assert.deepEqual(await page.locator(".menu-dish__details").allTextContents(), ["VG", "V", "VG", "VG"]);
    assert.equal(await page.locator("a[href^='mailto:harrogate@']").count(), 3);
    assert.equal(await page.locator(".christmas-venue a[href^='tel:']").count(), 1);
    assert.match(await page.locator("#festive-menu").innerText(), /May contain bones/);
    assert.match(await page.locator("#festive-menu").innerText(), /Vegan option available/);
    assert.match(await page.locator(".christmas-parties").innerText(), /regular dining tables as well as larger celebrations/);
    assert.equal(await page.locator(".christmas-actions .button").textContent(), "Book your Christmas table");
    assert.match(await page.locator(".christmas-hero__copy").innerText(), /Festive menu available from 23 November/);
    assert.match(await page.locator("#festive-menu .food-menu__intro").innerText(), /Available from 23 November/);
    assert.equal(await page.locator(".christmas-venue__actions .button").first().textContent(), "Book a Newcastle table");
  });
  await check("Keyboard pause and resume snowfall", async () => {
    await snowRunning(true);
    await page.locator("[data-snow-toggle]").focus();
    await page.keyboard.press("Enter");
    await snowRunning(false);
    assert.equal(await page.locator("[data-snow-toggle]").textContent(), "Resume snowfall");
    assert.equal(await page.locator(".christmas-snow span").first().evaluate(el => getComputedStyle(el).animationPlayState), "paused");
    await page.keyboard.press("Space");
    await snowRunning(true);
  });
  await check("Snow covers menu, party CTA and footer with a transparent persistent control", async () => {
    for (const selector of ["#festive-menu", "#christmas-parties", ".site-footer"]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await snowRunning(true);
      assert.equal(await page.locator("[data-snow-toggle]").isVisible(), true);
      const snow = await page.locator("[data-christmas-snow]").boundingBox();
      assert.equal(snow.y, 0);
      assert.equal(snow.height, page.viewportSize().height);
    }
    assert.equal(await page.locator("[data-snow-toggle]").evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
    assert.equal(await page.locator("[data-snow-toggle]").evaluate(el => getComputedStyle(el).mixBlendMode), "normal");
    assert.equal(await page.locator("[data-christmas-snow]").evaluate(el => getComputedStyle(el).pointerEvents), "none");
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
    await snowRunning(true);
  });
  await check("Dedicated group-party CTA follows the menu and offers both venues", async () => {
    assert.equal(await page.locator("#festive-menu").evaluate(el => el.nextElementSibling.id), "christmas-parties");
    const links = await page.locator("#christmas-parties a").evaluateAll(elements => elements.map(el => el.href));
    assert.equal(links.length, 2);
    for (const [index, location] of ["newcastle", "harrogate"].entries()) {
      const url = new URL(links[index]);
      assert.equal(url.pathname, `${location}@nipobraza.co.uk`);
      assert.match(url.searchParams.get("subject"), /Christmas party enquiry/);
      assert.match(url.searchParams.get("body"), /Number of guests:/);
    }
    assert.equal(await page.locator("#parties-title").innerText(), "Festive dining\nat NIPO");
  });
  await check("Visibility and page lifecycle handlers suspend snow", async () => {
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
    await snowRunning(false);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await snowRunning(true);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
    await snowRunning(false);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow")));
    await snowRunning(true);
  });
  await check("Reduced motion disables snow and its control dynamically", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await snowRunning(false);
    assert.equal(await page.locator("[data-snow-toggle]").isVisible(), false);
    assert.equal(await page.locator("[data-christmas-snow]").isVisible(), false);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await snowRunning(true);
  });
  await check("Hero actions lead to the menu and party contacts", async () => {
    await page.locator(".christmas-actions a[href='#festive-menu']").click();
    assert.equal(new URL(page.url()).hash, "#festive-menu");
    await page.locator("#festive-menu .food-menu__end a").click();
    assert.equal(new URL(page.url()).hash, "#christmas-enquiries");
  });
  await check("Responsive page and shared navigation fit from 320 to 1440 pixels", async () => {
    for (const width of [320, 390, 767, 768, 1024, 1199, 1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await settle();
      const layout = await page.evaluate(() => {
        const nav = document.querySelector(".desktop-nav");
        const actions = document.querySelector(".header-actions").getBoundingClientRect();
        const brand = document.querySelector(".header-brand").getBoundingClientRect();
        const r = nav.getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth, overlap: getComputedStyle(nav).display !== "none" && (r.right > actions.left || r.left < brand.right) };
      });
      assert.equal(layout.overflow, false, `${width}: no horizontal overflow`);
      assert.equal(layout.overlap, false, `${width}: navigation fits`);
    }
  });
  await check("Desktop and mobile image delivery and screenshots", async () => {
    for (const [name, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]]) {
      await page.setViewportSize({ width, height });
      await goto("/christmas/");
      await settle();
      if (width === 390) assert.equal(await page.locator("#festive-menu .menu-dish p:not(.menu-dish__exclusive)").first().evaluate(el => getComputedStyle(el).fontSize), "16px", "Mobile menu descriptions meet the reading-size floor");
      assert(await page.locator("main img").evaluateAll(images => images.every(img => img.naturalWidth > 0)));
      await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
      await page.screenshot({ path: `${output}/${name}-hero.png` });
      await page.locator("#christmas-parties").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/${name}-parties.png` });
      await page.locator("#festive-menu").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector("[data-snow-toggle]").dataset.snowSurface === "light");
      await page.screenshot({ path: `${output}/${name}-menu.png` });
      await page.locator(".christmas-parties__image").evaluate(el => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, window.scrollY + el.getBoundingClientRect().bottom - innerHeight + 10); });
      await page.waitForFunction(() => document.querySelector("[data-snow-toggle]").dataset.snowSurface === "dark");
      await page.screenshot({ path: `${output}/${name}-wine.png` });
    }
    assert.equal(await page.locator(".christmas-snow span").evaluateAll(spans => spans.filter(span => getComputedStyle(span).display !== "none").length), 14);
  });
  await check("Menu PDF link retains contrast on hover", async () => {
    await page.locator("#festive-menu .text-link").hover();
    assert.equal(await page.locator("#festive-menu .text-link").evaluate(el => getComputedStyle(el).color), "rgb(10, 85, 82)");
  });
  await check("Mobile navigation reaches Christmas and closes accessibly", async () => {
    await page.locator("[data-menu-toggle]").click();
    await page.locator("[data-mobile-menu] a[href='/christmas/']").click();
    assert.equal(new URL(page.url()).pathname, "/christmas/");
    assert.equal(await page.locator("[data-mobile-menu]").evaluate(el => el.open), false);
  });
  await check("Festive menu preview, link and all eight PDFs work", async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await goto("/menus/");
    assert.equal(await page.locator("[data-menu-preview='7'] .menu-link__detail").textContent(), "From 23 November · 3 courses £55 · 4 courses £65");
    await page.locator("[data-menu-preview='7']").focus();
    assert.equal(await page.locator("[data-menu-image].is-active").getAttribute("data-menu-photo"), "christmas-steak");
    const pdfs = await page.locator(".menu-pdf-link").evaluateAll(async links => Promise.all(links.map(async link => { const r = await fetch(link.href); return { status: r.status, type: r.headers.get("content-type"), magic: (await r.text()).slice(0, 5) }; })));
    assert.equal(pdfs.length, 8);
    pdfs.forEach(pdf => { assert.equal(pdf.status, 200); assert.match(pdf.type, /pdf/); assert.equal(pdf.magic, "%PDF-"); });
    await page.locator("[data-menu-preview='7']").click();
    assert.equal(new URL(page.url()).pathname + new URL(page.url()).hash, "/christmas/#festive-menu");
    await goto("/menus/set/");
    assert.equal(await page.locator("[data-menu-image].is-active").getAttribute("data-menu-image"), "5");
    assert.equal(await page.locator(".food-menu__end a").textContent(), "Book Newcastle");
  });
  await check("Harrogate remains coming soon with no ordinary reservations", async () => {
    await goto("/locations/harrogate/");
    assert.match(await page.locator("body").innerText(), /coming soon/i);
    assert.equal(await page.locator("a[href*='sevenrooms'], a[href^='tel:'], a[href^='mailto:newcastle@']").count(), 0);
    assert.equal(await page.locator(".desktop-nav a[href='/christmas/']").count(), 1);
  });
  await check("Christmas content and links work without JavaScript", async () => {
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const fallback = await noJs.newPage();
    await fallback.goto(origin + "/christmas/");
    assert.equal(await fallback.locator(".menu-dish").count(), 15);
    assert.equal(await fallback.locator("[data-snow-toggle]").isVisible(), false);
    assert.equal(await fallback.locator("[data-christmas-snow]").isVisible(), false);
    await fallback.locator(".christmas-actions a[href='#christmas-enquiries']").click();
    assert.equal(new URL(fallback.url()).hash, "#christmas-enquiries");
    await noJs.close();
  });
  assert.deepEqual(errors, [], "No browser script errors");
  await writeFile(`${output}/results.json`, JSON.stringify({ passed: results.length, results, errors }, null, 2));
  console.log(`${results.length} Christmas browser checks passed`);
} finally { await browser.close(); }
