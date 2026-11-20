/** Local campaign regression checks. Uses the existing production QA fixture. */
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4323";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("QA_ORIGIN must be local");
const output = "tmp/qa/promotions";
await mkdir(output, { recursive:true });
const results = [];
const check = async (name, run) => { await run(); results.push(name); console.log("PASS " + name); };
const browser = await chromium.launch({ headless:true, channel:process.env.PLAYWRIGHT_CHANNEL || "chrome" });
try {
  const context = await browser.newContext({ viewport:{ width:1440, height:1000 }, reducedMotion:"reduce" });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.addInitScript(() => localStorage.setItem("nipo-cookie-consent", JSON.stringify({ version:1, analytics:false, marketing:false, expires:Date.parse("2028-01-01T00:00:00Z") })));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.clock.install({ time:new Date("2026-11-28T12:00:00Z") });
  const banner = page.locator("[data-campaign-banner]");
  const promo = page.locator("[data-set-menu-promo]");
  const campaign = page.locator('[data-promo-offer="black-friday"]');
  const setMenu = page.locator('[data-promo-offer="set-menu"]');
  const goto = async path => {
    await page.goto(origin + path);
    await banner.waitFor({ state:"visible" });
    await page.clock.runFor(1100);
  };
  const layout = () => page.evaluate(() => {
    const banner = document.querySelector("[data-campaign-banner]").getBoundingClientRect();
    const header = document.querySelector("[data-site-header]").getBoundingClientRect();
    return { bannerTop:banner.top, bannerBottom:banner.bottom, headerTop:header.top, offset:parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--promo-banner-height")), overflow:document.documentElement.scrollWidth > innerWidth };
  });
  const settle = async () => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async image => { image.loading = "eager"; await image.decode().catch(() => {}); }));
      document.documentElement.style.scrollBehavior = "auto";
      scrollTo(0, 0);
    });
  };

  await check("Campaign is sitewide; popup is homepage-only; gift links and terms are exact", async () => {
    for (const path of ["/", "/concept/", "/christmas/", "/locations/harrogate/", "/menus/set/", "/privacy/"]) {
      await goto(path);
      assert.equal(await banner.locator("a").getAttribute("href"), "https://gift.nipobraza.co.uk/");
      assert.equal(await banner.locator("small").textContent(), "*Valid November 2026 & January 2027");
      assert.equal(await promo.count(), path === "/" ? 1 : 0);
      if (path === "/") {
        assert.equal(await promo.isVisible(), true);
        assert.equal(await campaign.isVisible(), true);
        assert.equal(await setMenu.isVisible(), false);
        assert.equal(await campaign.locator("a").getAttribute("href"), "https://gift.nipobraza.co.uk/");
        assert.equal(await campaign.locator(".set-menu-promo__terms").textContent(), "*Valid November 2026 & January 2027");
      }
    }
  });

  await check("Banner, header and popup fit desktop, tablet, mobile and short viewports", async () => {
    for (const [width, height] of [[1440,1000], [768,900], [390,844], [320,740], [844,390]]) {
      await page.setViewportSize({ width, height });
      await goto("/");
      await settle();
      const initial = await layout();
      assert.equal(initial.overflow, false, `${width}: horizontal overflow`);
      assert.equal(initial.bannerTop, 0);
      assert.ok(Math.abs(initial.headerTop - initial.bannerBottom) < 1, `${width}: header overlaps banner`);
      assert.ok(Math.abs(initial.offset - initial.bannerBottom) < 1);
      const box = await promo.boundingBox();
      assert.ok(box.y >= initial.bannerBottom + (width < 768 ? 80 : 96), `${width}: popup overlaps navigation`);
      assert.ok(box.x >= 0 && box.x + box.width <= width);
      assert.ok(box.y + box.height <= height);
      assert.equal(await promo.evaluate(el => getComputedStyle(el).animationName), "none");
      if (width === 1440 || width === 390) {
        const name = width === 1440 ? "desktop" : "mobile";
        await page.screenshot({ path:`${output}/${name}.png` });
        await page.screenshot({ path:`${output}/${name}-full.png`, fullPage:true });
      }
      await page.evaluate(() => scrollTo(0, 500));
      const scrolled = await layout();
      assert.equal(scrolled.bannerTop, 0);
      assert.ok(Math.abs(scrolled.headerTop - scrolled.bannerBottom) < 1);
    }
  });

  await page.setViewportSize({ width:390, height:844 });
  await check("Mobile dialog takes priority and Escape restores the popup", async () => {
    await goto("/");
    await page.locator("[data-menu-toggle]").click();
    await promo.waitFor({ state:"hidden" });
    await page.keyboard.press("Escape");
    await promo.waitFor({ state:"visible" });
    assert.equal(await page.locator("[data-menu-toggle]").evaluate(el => el === document.activeElement), true);
  });

  await check("Popup close and Escape dismiss only this page load; banner stays visible", async () => {
    await page.locator("[data-set-menu-dismiss]").focus();
    await page.keyboard.press("Enter");
    assert.equal(await promo.isVisible(), false);
    assert.equal(await banner.isVisible(), true);
    assert.equal(await page.locator("#main-content").evaluate(el => el === document.activeElement), true);
    await goto("/");
    await page.keyboard.press("Escape");
    assert.equal(await promo.isVisible(), false);
    await goto("/");
    assert.equal(await promo.isVisible(), true);
  });

  await check("Cookie consent hides the popup until a choice is made", async () => {
    await page.evaluate(() => localStorage.removeItem("nipo-cookie-consent"));
    // Disable the context's saved-choice init script by using a fresh page context.
    const fresh = await browser.newContext({ viewport:{ width:390, height:844 } });
    await fresh.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const firstVisit = await fresh.newPage();
    await firstVisit.clock.install({ time:new Date("2026-11-28T12:00:00Z") });
    await firstVisit.goto(origin);
    await firstVisit.locator("[data-cookie-banner]").waitFor({ state:"visible" });
    await firstVisit.clock.runFor(1100);
    assert.equal(await firstVisit.locator("[data-set-menu-promo]").isVisible(), false);
    await firstVisit.locator("[data-cookie-reject]").click();
    await firstVisit.locator("[data-set-menu-promo]").waitFor({ state:"visible" });
    await fresh.close();
  });

  await check("Already-open page expires precisely at midnight and restores a separately dismissible set menu", async () => {
    await page.clock.setSystemTime(new Date("2026-12-01T23:59:58Z"));
    await goto("/");
    assert.equal(await campaign.isVisible(), true);
    await page.locator("[data-set-menu-dismiss]").click();
    await page.clock.runFor(1000);
    await setMenu.waitFor({ state:"visible" });
    assert.equal(await banner.isVisible(), false);
    assert.equal(await campaign.isVisible(), false);
    assert.equal(await page.locator("body").evaluate(el => parseFloat(getComputedStyle(el).paddingTop)), 0);
    assert.equal((await layout()).headerTop, 0);
    await page.locator("[data-set-menu-dismiss]").click();
    assert.equal(await promo.isVisible(), false);
  });

  await check("Expiry transfers focus from the banner and Friday scheduling resumes", async () => {
    await page.clock.setSystemTime(new Date("2026-12-01T23:59:58Z"));
    await goto("/");
    await banner.locator("a").focus();
    await page.clock.runFor(1000);
    assert.equal(await page.locator("#main-content").evaluate(el => el === document.activeElement), true);
    for (const [time, visible] of [["2026-12-04T16:59:59Z", true], ["2026-12-04T17:00:00Z", false], ["2026-12-05T12:00:00Z", false], ["2026-12-06T00:00:00Z", true]]) {
      await page.clock.setSystemTime(new Date(time));
      await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
      assert.equal(await promo.isVisible(), visible);
    }
  });

  await check("Anchor links clear the sticky banner and navigation", async () => {
    await page.clock.setSystemTime(new Date("2026-11-28T12:00:00Z"));
    await goto("/menus/set/#set-menu");
    await page.locator("#set-menu").evaluate(el => el.scrollIntoView());
    await page.clock.runFor(1000);
    const section = await page.locator("#set-menu").boundingBox();
    const header = await page.locator("[data-site-header]").boundingBox();
    assert.ok(section.y >= header.y + header.height - 1);
  });

  await check("No browser script errors", async () => assert.deepEqual(errors, []));
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + "\n");
  await context.close();
} finally {
  await browser.close();
}
