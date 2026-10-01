/** Local-only location and signup browser regression checks. No real contacts. */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error("Set AGENT_BROWSER_BIN to the browser executable.");
const origin = "http://127.0.0.1:4323";
const results = [];
function run(...args) {
  let output;
  try { output = execFileSync(binary, ["--session", "nipo-locations", "--json", ...args], { encoding: "utf8", timeout: 30000 }); }
  catch (error) {
    if (error.code !== "ETIMEDOUT" || !error.stdout || !JSON.parse(error.stdout).success) throw error;
    output = error.stdout;
  }
  const response = JSON.parse(output);
  assert(response.success, response.error);
  return response.data;
}
const evaluate = source => run("eval", source).result;
const open = path => run("open", origin + path);
const check = (name, fn) => { fn(); results.push(name); console.log("PASS " + name); };
mkdirSync("tmp/qa", { recursive: true });
open("/");
evaluate("localStorage.setItem('nipo-cookie-consent',JSON.stringify({version:1,analytics:false,marketing:false,expires:Date.now()+86400000}))");
run("set", "media", "reduced-motion");
for (const [width, height] of process.argv.includes("--flows-only") ? [] : [[360,800],[390,844],[768,1024],[1024,768],[1440,1000]]) {
  run("set", "viewport", String(width), String(height));
  for (const path of ["/", "/locations/", "/locations/newcastle/", "/locations/harrogate/"]) {
    open(path);
    check(`${path} layout at ${width}px`, () => {
      const layout = evaluate(`(() => {
        const main = document.querySelector('main');
        return { heading: main.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > innerWidth + 1,
          collapsed: [...document.querySelectorAll('.photo')].filter(el => el.offsetParent !== null).filter(el => { const r=el.getBoundingClientRect();return r.width<1 || r.height<1; }).length,
          overlay: !!document.querySelector('astro-error-overlay, vite-error-overlay') };
      })()`);
      assert.equal(layout.heading, 1); assert.equal(layout.overflow, false); assert.equal(layout.collapsed, 0); assert.equal(layout.overlay, false);
    });
    if ((width === 390 || width === 1440) && path.includes("locations")) run("screenshot", `tmp/qa/${path.split('/').filter(Boolean).join('-')}-${width}.png`, "--full");
  }
}
open("/locations/harrogate/");
check("Harrogate has VIP actions and no operational details or menu links", () => {
  assert.equal(evaluate("document.querySelector('.header-book').getAttribute('href')"), "#newsletter");
  assert.equal(evaluate("[...document.querySelectorAll('a[href]')].filter(a=>a.href.includes('sevenrooms') || a.getAttribute('href').startsWith('tel:') || a.getAttribute('href').startsWith('/menus/')).length"), 0);
  const text = evaluate("document.querySelector('main').innerText");
  assert.match(text, /robata-style cooking/i); assert.match(text, /steakhouse/i);
  assert(!/opening hours|12 noon|95 Quayside|NE1 3DH/.test(text));
});
check("Harrogate signup validates, retries and sends its location", () => {
  run("scrollintoview", "#newsletter");
  run("click", "[type=submit]");
  assert.match(evaluate("document.querySelector('[data-error=email]').textContent"), /valid email/);
  run("fill", "[name=firstName]", "Harrogate Test");
  run("fill", "[name=email]", "harrogate-qa@example.com");
  run("check", "[name=consent]");
  evaluate("fetch('/__qa/mode?value=failure').then(r=>r.json())");
  evaluate("window.__signupBodies=[];const originalFetch=window.fetch;window.fetch=(url,options)=>{if(url==='/api/vip-signup')window.__signupBodies.push(JSON.parse(options.body));return originalFetch(url,options);}");
  run("click", "[type=submit]");
  run("wait", "[data-form-status]:not(:empty)");
  assert.equal(evaluate("document.querySelector('[data-form-success]').hidden"), true);
  evaluate("fetch('/__qa/mode?value=success').then(r=>r.json())");
  run("click", "[type=submit]");
  run("wait", "[data-form-success]:not([hidden])");
  assert.match(evaluate("document.querySelector('[data-form-success]').innerText"), /Harrogate VIP list/);
  assert.equal(evaluate("window.__signupBodies.at(-1).location"), "harrogate");
  assert.equal(evaluate("document.activeElement.matches('[data-form-success]')"), true);
});
run("set", "viewport", "390", "844");
open("/locations/harrogate/");
check("Mobile VIP action closes navigation and reaches the signup", () => {
  run("click", "[data-menu-toggle]");
  run("click", "[data-mobile-menu] .button");
  assert.equal(evaluate("document.querySelector('[data-mobile-menu]').open"), false);
  assert.equal(evaluate("location.hash"), "#newsletter");
});
open("/contact/#faq");
check("Old contact links retain the FAQ destination", () => {
  assert.equal(evaluate("location.pathname"), "/locations/newcastle/");
  assert.equal(evaluate("location.hash"), "#faq");
  assert(evaluate("!!document.querySelector('#faq')"));
  assert.match(evaluate("document.querySelector('.header-book').href"), /sevenrooms/);
});
writeFileSync("tmp/qa/locations-report.json", JSON.stringify({ results }, null, 2));
console.log(`Passed ${results.length} location browser checks.`);
run("close");
