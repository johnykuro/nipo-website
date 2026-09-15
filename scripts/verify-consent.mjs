/** Local browser tests. Google requests are intercepted; no real tracking fires. */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error("Set AGENT_BROWSER_BIN to the installed agent-browser executable.");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4322";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local preview.");
const results = [];
const run = (...args) => {
  let output;
  try { output = execFileSync(binary, ["--session", "nipo-consent", "--json", ...args], { encoding: "utf8", timeout: 30000 }); }
  catch (error) {
    // Windows daemon startup may retain stdout after a completed CLI response.
    if (error.code !== "ETIMEDOUT" || !error.stdout || !JSON.parse(error.stdout).success) throw error;
    output = error.stdout;
  }
  const result = JSON.parse(output);
  assert(result.success, result.error);
  return result.data;
};
const evaluate = (source) => run("eval", source).result;
const open = (path = "/") => run("open", origin + path);
const check = (name, callback) => { callback(); results.push(name); console.log("PASS " + name); };
const loaded = () => evaluate("!!document.querySelector('script[src*=googletagmanager]')");
const visible = () => evaluate("!document.querySelector('[data-cookie-banner]').hidden");
const openSettings = () => { run("focus", "[data-cookie-settings]"); run("press", "Enter"); };
const latestState = () => evaluate("Array.from(window.dataLayer || []).filter(x=>x[0]==='consent').at(-1)?.[2]");
const reset = (value = "null") => {
  evaluate(`localStorage.setItem('nipo-cookie-consent', ${JSON.stringify(value)})`);
  open();
};
mkdirSync("tmp/qa", { recursive: true });
run("network", "route", "**/*googletagmanager.com/**", "--abort");
run("network", "route", "**/*google-analytics.com/**", "--abort");
run("set", "viewport", "390", "844");
open(); reset();
run("network", "requests", "--clear"); open();
check("First visit blocks Google requests and shows equally available choices", () => {
  assert.equal(loaded(), false); assert.equal(visible(), true);
  assert(!JSON.stringify(run("network", "requests")).includes("googletagmanager.com"));
  assert.equal(evaluate("document.querySelectorAll('[data-cookie-accept], [data-cookie-reject]').length"), 2);
  assert.equal(evaluate("document.documentElement.scrollWidth > innerWidth"), false);
});
run("screenshot", "tmp/qa/cookie-mobile.png");
run("click", "[data-cookie-reject]");
check("Reject persists across pages without loading GTM", () => {
  assert.equal(visible(), false); assert.equal(loaded(), false);
  open("/contact/"); assert.equal(visible(), false); assert.equal(loaded(), false);
});
openSettings();
check("Footer settings reveal separate unchecked purposes with keyboard focus", () => {
  assert.equal(visible(), true);
  assert.equal(evaluate("document.activeElement.id"), "cookie-title");
  assert.equal(evaluate("document.querySelector('[data-cookie-analytics]').checked"), false);
  assert.equal(evaluate("document.querySelector('[data-cookie-marketing]').checked"), false);
});
run("check", "[data-cookie-analytics]"); run("click", "[data-cookie-save]");
check("Analytics-only consent loads GTM once and denies advertising", () => {
  assert.equal(loaded(), true);
  assert.equal(latestState().analytics_storage, "granted");
  assert.equal(latestState().ad_storage, "denied");
  assert.equal(latestState().ad_user_data, "denied");
  assert.equal(latestState().ad_personalization, "denied");
  assert.equal(evaluate("document.querySelectorAll('script[src*=googletagmanager]').length"), 1);
  open("/menus/"); assert.equal(loaded(), true); assert.equal(visible(), false);
});
evaluate("document.cookie='_ga=test; path=/';document.cookie='_ga_TEST=test; path=/'");
openSettings(); run("click", "[data-cookie-reject]");
run("wait", "[data-cookie-settings]");
check("Withdrawal reloads without tags and clears known analytics cookies", () => {
  assert.equal(loaded(), false); assert.equal(visible(), false);
  assert.equal(evaluate("document.cookie.includes('_ga=') || document.cookie.includes('_ga_TEST=')"), false);
});
openSettings(); run("click", "[data-cookie-accept]");
check("Accept all grants both purposes; reopening preserves the choice", () => {
  assert.equal(latestState().analytics_storage, "granted");
  assert.equal(latestState().ad_storage, "granted");
  openSettings();
  assert.equal(evaluate("document.querySelector('[data-cookie-analytics]').checked && document.querySelector('[data-cookie-marketing]').checked"), true);
});
run("click", "[data-cookie-reject]"); run("wait", "[data-cookie-settings]");
reset("invalid JSON");
check("Malformed saved consent fails closed", () => { assert.equal(loaded(), false); assert.equal(visible(), true); });
reset(JSON.stringify({ version: 1, analytics: true, marketing: true, expires: 1 }));
check("Expired consent fails closed and asks again", () => { assert.equal(loaded(), false); assert.equal(visible(), true); });
run("set", "viewport", "1440", "900");
run("screenshot", "tmp/qa/cookie-desktop.png");
run("click", "[data-cookie-reject]");
writeFileSync("tmp/qa/consent-results.json", JSON.stringify({ origin, checks: results }, null, 2));
run("close");
console.log(results.length + " consent browser checks passed.");
