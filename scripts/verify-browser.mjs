/**
 * Local-only browser regression checks against scripts/qa-server.mjs.
 * Newsletter responses and the dynamically loaded Turnstile API use local mocks.
 * AGENT_BROWSER_BIN must point to the agent-browser executable.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN;
if (!binary) throw new Error("Set AGENT_BROWSER_BIN to the installed agent-browser executable.");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4323";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("QA_ORIGIN must be local.");
const results = [];
function command(...args) {
  let output;
  try {
    output = execFileSync(binary, ["--session","nipo-regression","--json", ...args], {encoding:"utf8",timeout:30000});
  } catch (error) {
    // On Windows the newly spawned daemon can retain stdout after the CLI exits.
    // Accept only a complete successful response, never an uncertain action.
    if (error.code !== "ETIMEDOUT" || !error.stdout || !JSON.parse(error.stdout).success) throw error;
    output = error.stdout;
  }
  const response = JSON.parse(output);
  if (!response.success) throw new Error(response.error || output);
  return response.data;
}
const evaluate = source => command("eval",source).result;
const check = (name, fn) => { fn(); results.push(name); console.log("PASS " + name); };
const open = path => command("open",origin + path);
const delay = ms => evaluate("new Promise(resolve => setTimeout(() => resolve(true), " + ms + "))");
mkdirSync("tmp/qa",{recursive:true});
command("open",origin);
evaluate("localStorage.setItem('nipo-cookie-consent',JSON.stringify({version:1,analytics:false,marketing:false,expires:Date.now()+86400000}))");
command("open",origin);
evaluate("fetch('/__qa/mode?value=success').then(r=>r.json())");

command("set","media","dark");
command("set","viewport","390","844");
open("/");
check("Mobile navigation opens, traps focus, closes with Escape and restores focus", () => {
  command("click","[data-menu-toggle]");
  assert.equal(evaluate("document.querySelector('[data-mobile-menu]').open"),true);
  command("press","Shift+Tab");
  assert.equal(evaluate("!!document.activeElement.closest('[data-mobile-menu]')"),true);
  command("press","Escape");
  assert.equal(evaluate("document.querySelector('[data-mobile-menu]').open"),false);
  assert.equal(evaluate("document.activeElement.matches('[data-menu-toggle]')"),true);
});
check("Mobile navigation follows the Concept link", () => {
  command("click","[data-menu-toggle]"); command("click","[data-mobile-menu] a[href='/concept/']");
  assert.equal(evaluate("location.pathname"),"/concept/");
});
open("/gallery/");
check("Lightbox next/previous, keyboard, focus restoration and swipe", () => {
  command("click","[data-photo-id='sushi-table']");
  assert.equal(evaluate("document.querySelector('[data-lightbox]').open"),true);
  command("press","ArrowRight");
  assert.equal(evaluate("document.querySelector('[data-lightbox-image]').src === document.querySelector('[data-photo-id=\"sliced-steak\"]').href"),true);
  assert.equal(evaluate("document.querySelector('[data-lightbox-caption]').textContent === document.querySelector('[data-photo-id=\"sliced-steak\"]').dataset.caption"),true);
  command("click","[data-lightbox-prev]");
  assert.equal(evaluate("document.querySelector('[data-lightbox-image]').src === document.querySelector('[data-photo-id=\"sushi-table\"]').href"),true);
  evaluate("(()=>{const i=document.querySelector('[data-lightbox-image]');i.dispatchEvent(new PointerEvent('pointerdown',{clientX:300,clientY:250,bubbles:true}));i.dispatchEvent(new PointerEvent('pointerup',{clientX:100,clientY:255,bubbles:true}));})()");
  assert.equal(evaluate("document.querySelector('[data-lightbox-image]').src === document.querySelector('[data-photo-id=\"sliced-steak\"]').href"),true);
  command("screenshot","tmp/qa/lightbox-mobile.png");
  command("press","Escape");
  assert.equal(evaluate("document.activeElement.dataset.photoId"),"sushi-table");
});
open("/menus/");
check("Menu hover and keyboard focus update photography; food opens the priced main menu", () => {
  command("hover","[data-menu-preview='1']");
  assert.equal(evaluate("document.querySelector('[data-menu-image].is-active').dataset.menuImage"),"1");
  command("focus","[data-menu-preview='2']");
  assert.equal(evaluate("document.querySelector('[data-menu-image].is-active').dataset.menuImage"),"2");
  command("click","[data-menu-preview='0']");
  assert.equal(evaluate("location.hash"),"#main-menu");
  const counts = evaluate("(() => { const graph=JSON.parse(document.querySelector('script[type=\"application/ld+json\"]').textContent)['@graph']; const menu=graph.find(n=>n.hasMenuSection); return {visible:document.querySelectorAll('.menu-dish').length,schema:menu.hasMenuSection.reduce((total,section)=>total+section.hasMenuItem.length,0)}; })()");
  assert(counts.visible > 0); assert.equal(counts.visible, counts.schema);
  assert.equal(evaluate("document.querySelector('#main-menu').innerText.includes('£')"),false);
});
check("All seven menu PDF links return PDFs", () => {
  const data = evaluate("Promise.all([...document.querySelectorAll('.menu-links a[target]')].map(async a=>{const r=await fetch(a.href);return {status:r.status,type:r.headers.get('content-type'),magic:(await r.text()).slice(0,5)}}))");
  assert.equal(data.length,7); data.forEach(pdf=>{assert.equal(pdf.status,200);assert.match(pdf.type,/pdf/);assert.equal(pdf.magic,"%PDF-");});
});
check("Steaks opens its dedicated menu with a clearly labelled main-menu PDF", () => {
  command("click", "[data-menu-preview='1']");
  assert.equal(evaluate("location.pathname"), "/menus/steaks/");
  assert.equal(evaluate("location.hash"), "#steaks-menu");
  assert.equal(evaluate("document.querySelector('h1').textContent"), "Steaks");
  assert.equal(evaluate("document.querySelector('.menu-preview.is-active').dataset.menuPhoto"), "sliced-steak");
  assert.equal(evaluate("document.querySelector('#steaks-menu .text-link').getAttribute('href')"), "/menus/nipo-main.pdf");
  assert.match(evaluate("document.querySelector('#steaks-menu .text-link').textContent"), /View full À La Carte PDF/);
});
command("set","viewport","768","900"); open("/");
check("Tablet navigation preserves the brand mark without horizontal overflow", () => {
  assert(evaluate("document.querySelector('.header-brand img').getBoundingClientRect().width") >= 35);
  assert.equal(evaluate("document.documentElement.scrollWidth > innerWidth"), false);
});
command("set","viewport","1440","900"); open("/");
check("Hero recovers a transient decode failure and cycles through every slide both ways", () => {
  evaluate("document.querySelector('[data-set-menu-dismiss]')?.click()");
  evaluate("window.__originalHeroDecode=HTMLImageElement.prototype.decode; window.__rejectThirdOnce=true; HTMLImageElement.prototype.decode=function(){ const slides=[...document.querySelectorAll('[data-hero-slide]')]; if(window.__rejectThirdOnce && this.closest('[data-hero-slide]')===slides[2]){ window.__rejectThirdOnce=false; return Promise.reject(new DOMException('Image source changed','EncodingError')); } return window.__originalHeroDecode.call(this); }");
  const waitForSlide = (index) => evaluate(`new Promise((resolve,reject)=>{const started=Date.now();const poll=()=>{if(document.querySelector('[data-hero]').dataset.slide==='${index}')resolve(true);else if(Date.now()-started>5000)reject(new Error('Slide ${index} did not appear'));else setTimeout(poll,30)};poll()})`);
  for (const [direction, indices] of [["next", [1,2,3,4,0]], ["prev", [4,3,2,1,0]]]) {
    for (const index of indices) {
      command("click", `[data-hero-${direction}]`); waitForSlide(index);
      assert.equal(evaluate("document.querySelector('[data-hero-count]').textContent"), String(index + 1).padStart(2,"0") + " / 05");
    }
  }
  assert.equal(evaluate("window.__rejectThirdOnce"),false);
  evaluate("HTMLImageElement.prototype.decode=window.__originalHeroDecode");
});
check("Previous skips an unavailable slide backwards and can revisit it after recovery", () => {
  evaluate("window.__originalHeroDecode=HTMLImageElement.prototype.decode; window.__thirdUnavailable=true; HTMLImageElement.prototype.decode=function(){if(window.__thirdUnavailable && this.closest('[data-hero-slide]')===document.querySelectorAll('[data-hero-slide]')[2])return Promise.reject(new DOMException('Image unavailable','EncodingError')); return window.__originalHeroDecode.call(this); }");
  const move = (direction, index) => {
    command("click", `[data-hero-${direction}]`);
    evaluate(`new Promise((resolve,reject)=>{const started=Date.now();const poll=()=>{if(document.querySelector('[data-hero]').dataset.slide==='${index}')resolve(true);else if(Date.now()-started>5000)reject(new Error('Slide ${index} did not appear'));else setTimeout(poll,30)};poll()})`);
  };
  move("prev",4); move("prev",3); move("prev",1);
  evaluate("window.__thirdUnavailable=false"); move("next",2);
  evaluate("HTMLImageElement.prototype.decode=window.__originalHeroDecode");
});
open("/");
check("Hero advances after seven seconds and pauses on request", () => {
  command("mouse","move","5","100"); evaluate("document.activeElement.blur()");
  const start = evaluate("document.querySelector('[data-hero]').dataset.slide");
  delay(7400);
  assert.notEqual(evaluate("document.querySelector('[data-hero]').dataset.slide"),start);
  command("click","[data-hero-pause]"); command("mouse","move","5","100"); evaluate("document.activeElement.blur()");
  const paused = evaluate("document.querySelector('[data-hero]').dataset.slide");
  delay(7200);
  assert.equal(evaluate("document.querySelector('[data-hero]').dataset.slide"),paused);
  command("click","[data-hero-next]");
  assert.notEqual(evaluate("document.querySelector('[data-hero]').dataset.slide"),paused);
});
check("Hero pauses offscreen", () => {
  command("click","[data-hero-pause]"); command("scrollintoview","#newsletter"); delay(300);
  assert.equal(evaluate("document.querySelector('[data-hero]').dataset.paused"),"true");
});
check("Gallery rail moves, pauses on hover and can be dragged", () => {
  command("scrollintoview","[data-gallery-rail]"); command("mouse","move","5","110");
  const a = evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"); delay(500);
  assert.notEqual(evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"),a);
  command("hover","[data-gallery-rail]");
  const b = evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"); delay(300);
  assert.equal(evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"),b);
  const rect = evaluate("(()=>{const r=document.querySelector('[data-gallery-rail]').getBoundingClientRect();return {y:Math.round(r.top+120)}})()");
  command("mouse","move","700",String(rect.y)); command("mouse","down");
  command("mouse","move","500",String(rect.y)); command("mouse","up");
  assert.notEqual(evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"),b);
  assert.equal(evaluate("document.querySelector('[data-lightbox]').open"),false);
});
command("set","media","dark","reduced-motion"); open("/");
check("Reduced motion disables automatic hero and rail movement, retains manual slides", () => {
  assert.equal(evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"),true);
  const a=evaluate("document.querySelector('[data-hero]').dataset.slide"); delay(7200);
  assert.equal(evaluate("document.querySelector('[data-hero]').dataset.slide"),a);
  command("click","[data-hero-next]");
  assert.notEqual(evaluate("document.querySelector('[data-hero]').dataset.slide"),a);
  command("scrollintoview","[data-gallery-rail]"); command("mouse","move","5","110");
  const b=evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"); delay(400);
  assert.equal(evaluate("getComputedStyle(document.querySelector('[data-gallery-track]')).transform"),b);
});
const fillSignup = () => {
  command("fill","#first-name","Nipo QA"); command("fill","#email","nipo-qa@example.com");
  command("check","[name='consent']");
  evaluate("(()=>{let input=document.querySelector('[name=cf-turnstile-response]');if(!input){input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';document.querySelector('[data-vip-form]').append(input)}input.value='local-mock-token';})()");
};
open("/"); command("scrollintoview","#newsletter");
check("Newsletter validation prevents invalid submissions", () => {
  command("click","[data-vip-form] button[type='submit']");
  assert.equal(evaluate("document.querySelector('[name=firstName]').getAttribute('aria-invalid')"),"true");
  assert.match(evaluate("document.querySelector('[data-error=consent]').textContent"),/confirm/);
});
check("Newsletter success hides form and focuses confirmation with mocked API", () => {
  fillSignup(); command("click","[data-vip-form] button[type='submit']"); delay(250);
  assert.equal(evaluate("document.querySelector('[data-vip-form]').hidden"),true);
  assert.equal(evaluate("document.activeElement.hasAttribute('data-form-success')"),true);
  command("screenshot","tmp/qa/newsletter-success.png");
});

evaluate("fetch('/__qa/mode?value=server-error').then(r=>r.json())");
open("/"); command("scrollintoview","#newsletter");
check("Newsletter server errors remain actionable and re-enable submit", () => {
  fillSignup(); command("click","[data-vip-form] button[type='submit']"); delay(250);
  assert.equal(evaluate("document.querySelector('[data-vip-form]').hidden"),false);
  assert.match(evaluate("document.querySelector('[data-form-status]').textContent"),/try again/);
  assert.equal(evaluate("document.querySelector('[data-vip-form] button[type=submit]').disabled"),false);
  assert.equal(evaluate("document.querySelector('[name=email]').getAttribute('aria-invalid')"),"true");
  command("screenshot","tmp/qa/newsletter-server-error.png");
});
 evaluate("fetch('/__qa/mode?value=network-error').then(r=>r.json())");
open("/"); command("scrollintoview","#newsletter");
check("Newsletter network failure permits retry", () => {
  fillSignup(); command("click","[data-vip-form] button[type='submit']"); delay(250);
  assert.match(evaluate("document.querySelector('[data-form-status]').textContent"),/connection/);
  assert.equal(evaluate("document.querySelector('[data-vip-form] button[type=submit]').disabled"),false);
});
check("Image failure keeps content and navigation available", () => {
  evaluate("(()=>{const p=document.querySelector('.hero-slide.is-active picture');p.querySelectorAll('source').forEach(s=>s.remove());const i=p.querySelector('img');i.removeAttribute('srcset');i.src='/missing-qa-image.webp';})()");
  delay(250);
  assert.equal(evaluate("!!document.querySelector('.hero-slide.is-active .photo.is-failed')"),true);
  assert.equal(evaluate("!!document.querySelector('.hero-content .button--booking')"),true);
});
evaluate("fetch('/__qa/mode?value=no-js').then(r=>r.json())");
command("set","viewport","390","844");
open("/");
check("Navigation, images, main menu and gallery remain usable without scripts", () => {
  assert.equal(evaluate("document.documentElement.classList.contains('js')"),false);
  assert.equal(evaluate("document.querySelectorAll('.no-js-nav > a, .no-js-nav > details').length"),4);
  assert.equal(evaluate("getComputedStyle(document.querySelector('.hero-slide')).opacity"),"1");
  command("click",".no-js-nav a[href='/menus/']");
  command("click","[data-menu-preview='0']"); assert.equal(evaluate("location.hash"),"#main-menu");
  open("/gallery/"); assert.match(evaluate("document.querySelector('[data-lightbox-item]').getAttribute('href')"),/webp/);
});
evaluate("fetch('/__qa/mode?value=success').then(r=>r.json())");
writeFileSync("tmp/qa/interaction-results.json",JSON.stringify({origin,checks:results},null,2));
command("close"); console.log(results.length + " browser checks passed.");
