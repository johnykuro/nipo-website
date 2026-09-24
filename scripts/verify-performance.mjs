/** Run against scripts/qa-server.mjs: all newsletter/challenge responses are local mocks. */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error("Set AGENT_BROWSER_BIN to the installed agent-browser executable.");
const origin = "http://127.0.0.1:4323";
const results = [];
const run = (...args) => {
  let output;
  try { output = execFileSync(binary, ["--session", "nipo-performance", "--json", ...args], { encoding: "utf8", timeout: 30000 }); }
  catch (error) {
    if (error.code !== "ETIMEDOUT" || !error.stdout || !JSON.parse(error.stdout).success) throw error;
    output = error.stdout;
  }
  const result = JSON.parse(output);
  assert(result.success, result.error);
  return result.data;
};
const evaluate = (code) => run("eval", code).result;
const waitFor = (condition) => evaluate(`new Promise((resolve, reject) => {
  const end = performance.now() + 12000;
  const check = () => { if (${condition}) resolve(true); else if (performance.now() > end) reject(new Error('Condition timed out')); else setTimeout(check, 50); };
  check();
})`);
const open = () => run("open", origin);
const check = (name, fn) => { fn(); results.push(name); console.log("PASS " + name); };
const setMode = (kind, value) => evaluate(`fetch('/__qa/${kind}?value=${value}').then(r=>r.json())`);
mkdirSync("tmp/qa", { recursive: true });
open();
evaluate("localStorage.setItem('nipo-cookie-consent',JSON.stringify({version:1,analytics:false,marketing:false,expires:Date.now()+86400000}))");
run("set", "viewport", "390", "844");
run("set", "media", "dark", "reduced-motion");
open();
run("snapshot", "-i");
check("Mobile initial view requests only the first hero photo, without gallery code or Turnstile", () => {
  const state = evaluate(`({images:document.querySelectorAll('[data-hero-slide] img').length,
    templates:document.querySelectorAll('[data-hero-photo]').length,
    resources:performance.getEntriesByType('resource').map(r=>r.name),
    enhanced:document.querySelector('[data-gallery-rail]').classList.contains('is-enhanced')})`);
  assert.equal(state.images, 1); assert.equal(state.templates, 4); assert.equal(state.enhanced, false);
  assert(!state.resources.some(url => /gallery-rail|Draggable|turnstile/.test(url)));
  assert(!state.resources.some(url => /Caa_cjgN|ABPeRnLS|Dl2ZH6DI|d7kZC2gn/.test(url)));
  run("screenshot", "tmp/qa/performance-mobile.png");
});
check("Manual navigation loads and decodes the next photo under reduced motion", () => {
  run("click", "[data-hero-next]");
  waitFor("document.querySelector('[data-hero]').dataset.slide === '1'");
  assert(evaluate("document.querySelector('.hero-slide.is-active img').naturalWidth > 0"));
  assert.equal(evaluate("document.querySelectorAll('[data-hero-slide] img').length"), 2);
});
check("An unloaded/slow photo keeps the current slide visible, and newer navigation wins", () => {
  evaluate(`window.__decode=HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode=function(){
      if(this.closest('[data-hero-slide]')===document.querySelectorAll('[data-hero-slide]')[2])
        return new Promise(resolve=>window.__finishPhoto=()=>window.__decode.call(this).then(resolve));
      return window.__decode.call(this);
    }`);
  run("click", "[data-hero-next]");
  assert.equal(evaluate("document.querySelector('[data-hero]').dataset.slide"), "1");
  run("click", "[data-hero-prev]");
  waitFor("document.querySelector('[data-hero]').dataset.slide === '0'");
  evaluate("window.__finishPhoto(); HTMLImageElement.prototype.decode=window.__decode");
  assert.equal(evaluate("document.querySelector('[data-hero]').dataset.slide"), "0");
});
check("Gallery enhancement supports keyboard focus before scrolling and reduced motion", () => {
  evaluate("document.querySelector('[data-gallery-rail] a').focus({preventScroll:true})");
  waitFor("document.querySelector('[data-gallery-rail]').classList.contains('is-enhanced')");
  assert(evaluate("document.activeElement.getBoundingClientRect().left >= 0"));
  run("scrollintoview", "[data-gallery-rail]");
  waitFor("document.querySelector('[data-gallery-rail]').classList.contains('is-enhanced')");
  const transform = evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform");
  evaluate("new Promise(resolve=>setTimeout(resolve,300))");
  assert.equal(evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"), transform);
});
check("Newsletter approach loads the challenge once with the expected configuration", () => {
  run("scrollintoview", "#newsletter");
  waitFor("window.__qaChallenge?.renders === 1");
  run("focus", "#first-name"); run("focus", "#email");
  assert.equal(evaluate("window.__qaChallenge.renders"), 1);
  assert.equal(evaluate("window.__qaChallenge.options['response-field-name']"), "cf-turnstile-response");
  assert.equal(evaluate("window.__qaChallenge.options.action"), "turnstile-spin-v2");
});
check("A failed challenge download can retry on form focus", () => {
  setMode("turnstile-mode", "load-error"); open();
  run("scrollintoview", "#newsletter");
  waitFor("document.querySelector('[data-error=turnstile]').textContent.includes('could not load')");
  setMode("turnstile-mode", "success"); run("focus", "#first-name");
  waitFor("window.__qaChallenge?.renders === 1 && !!document.querySelector('[name=cf-turnstile-response]').value");
  assert.equal(evaluate("document.querySelector('[data-error=turnstile]').textContent"), "");
});
check("Pending, failed and expired challenges cannot submit; completing one permits signup", () => {
  setMode("turnstile-mode", "pending"); open();
  evaluate(`window.__signupRequests=0; const originalFetch=window.fetch;
    window.fetch=(...args)=>{if(args[0]==='/api/vip-signup')window.__signupRequests++;return originalFetch(...args)}`);
  run("fill", "#first-name", "Nipo QA"); run("fill", "#email", "nipo-qa@example.com"); run("check", "[name=consent]");
  waitFor("window.__qaChallenge?.renders === 1");
  run("click", "[data-vip-form] button[type=submit]");
  assert.equal(evaluate("document.querySelector('[data-vip-form]').hidden"), false);
  assert.equal(evaluate("window.__signupRequests"), 0);
  assert.match(evaluate("document.querySelector('[data-error=turnstile]').textContent"), /security check/);
  evaluate("window.__qaChallenge.fail()");
  assert.match(evaluate("document.querySelector('[data-error=turnstile]').textContent"), /could not complete/);
  evaluate("window.__qaChallenge.complete();window.__qaChallenge.expire()");
  run("click", "[data-vip-form] button[type=submit]");
  assert.equal(evaluate("document.querySelector('[data-vip-form]').hidden"), false);
  assert.equal(evaluate("window.__signupRequests"), 0);
  evaluate("window.__qaChallenge.complete()");
  run("click", "[data-vip-form] button[type=submit]");
  waitFor("document.querySelector('[data-vip-form]').hidden");
});
check("A server rejection resets the widget and allows a successful retry", () => {
  setMode("turnstile-mode", "success"); setMode("mode", "server-error"); open();
  run("fill", "#first-name", "Nipo QA"); run("fill", "#email", "nipo-qa@example.com"); run("check", "[name=consent]");
  waitFor("!!document.querySelector('[name=cf-turnstile-response]')?.value");
  run("click", "[data-vip-form] button[type=submit]");
  waitFor("window.__qaChallenge.resets === 1");
  setMode("mode", "success");
  waitFor("!!document.querySelector('[name=cf-turnstile-response]').value");
  run("click", "[data-vip-form] button[type=submit]");
  waitFor("document.querySelector('[data-vip-form]').hidden");
});
writeFileSync("tmp/qa/performance-results.json", JSON.stringify({ origin, checks: results }, null, 2));
run("close");
console.log(`${results.length} performance behaviour checks passed.`);
