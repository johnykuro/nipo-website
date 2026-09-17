/** Analytics/marketing tags load only after an optional purpose is accepted. Maps have a separate click-to-load control. */
type Choice = { analytics: boolean; marketing: boolean };
type SavedChoice = Choice & { version: number; expires: number };
const storageKey = "nipo-cookie-consent";
const version = 1;
const lifetime = 180 * 24 * 60 * 60 * 1000;
const banner = document.querySelector<HTMLElement>("[data-cookie-banner]")!;
const preferences = document.querySelector<HTMLElement>("[data-cookie-preferences]")!;
const analytics = document.querySelector<HTMLInputElement>("[data-cookie-analytics]")!;
const marketing = document.querySelector<HTMLInputElement>("[data-cookie-marketing]")!;
const manage = document.querySelector<HTMLButtonElement>("[data-cookie-manage]")!;
const save = document.querySelector<HTMLButtonElement>("[data-cookie-save]")!;
const settings = document.querySelector<HTMLButtonElement>("[data-cookie-settings]")!;
const consentWindow = window as Window & { dataLayer?: unknown[] };
const dataLayer = consentWindow.dataLayer ??= [];
let loaded = false;
let analyticsStarted = false;
let marketingStarted = false;
let choice: Choice = { analytics: false, marketing: false };
let returnFocus: HTMLElement | null = null;
// gtag uses arguments objects in the shared GTM queue.
function gtag(..._args: unknown[]) { dataLayer.push(arguments); }
const state = (selected: Choice) => ({
  analytics_storage: selected.analytics ? "granted" : "denied",
  ad_storage: selected.marketing ? "granted" : "denied",
  ad_user_data: selected.marketing ? "granted" : "denied",
  ad_personalization: selected.marketing ? "granted" : "denied",
  personalization_storage: selected.marketing ? "granted" : "denied",
  functionality_storage: "granted", security_storage: "granted",
});
gtag("consent", "default", state(choice));
gtag("set", "ads_data_redaction", true);
function readChoice(): SavedChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return saved?.version === version && Number.isFinite(saved.expires) && saved.expires > Date.now() &&
      typeof saved.analytics === "boolean" && typeof saved.marketing === "boolean" ? saved : null;
  } catch { return null; }
}
function loadTags(selected: Choice) {
  gtag("consent", "update", state(selected));
  if (!loaded && (selected.analytics || selected.marketing)) {
    loaded = true;
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-542R3BH8";
    document.head.appendChild(script);
  }
  dataLayer.push({ event: "nipo_consent_update", analytics_consent: selected.analytics, marketing_consent: selected.marketing });
  // A denied tag can consume GTM's once-per-page firing opportunity. Emit each
  // purpose's startup event only after that purpose is granted, once per page.
  if (selected.analytics && !analyticsStarted) {
    analyticsStarted = true;
    dataLayer.push({ event: "nipo_analytics_ready" });
  }
  if (selected.marketing && !marketingStarted) {
    marketingStarted = true;
    dataLayer.push({ event: "nipo_marketing_ready" });
  }
}
function clearOptionalCookies(selected: Choice) {
  // Expire the first-party cookies used by Google Analytics/Ads and common social tags.
  const patterns = [
    ...(!selected.analytics ? [/^_ga(?:_|$)/, /^_gid$/, /^_gat(?:_|$)/, /^_clck$/, /^_clsk$/] : []),
    ...(!selected.marketing ? [/^_gcl_/, /^_gac_/, /^_fb[pc]$/, /^_ttp$/, /^ttcsid/] : []),
  ];
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, index) => parts.slice(index).join("."))];
  const paths = new Set(["/", location.pathname, ...location.pathname.split("/").map((_, index, all) => all.slice(0, index + 1).join("/") || "/")]);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!patterns.some((pattern) => pattern.test(name))) continue;
    for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; Path=${path};${domain ? ` Domain=${domain};` : ""} SameSite=Lax`;
    }
  }
}
function choose(selected: Choice) {
  const revoked = (choice.analytics && !selected.analytics) || (choice.marketing && !selected.marketing);
  choice = selected;
  try { localStorage.setItem(storageKey, JSON.stringify({ ...selected, version, expires: Date.now() + lifetime })); } catch { /* Keep the current page usable when storage is blocked. */ }
  loadTags(selected);
  clearOptionalCookies(selected);
  banner.hidden = true;
  document.querySelector<HTMLElement>("[data-cookie-status]")!.textContent = "Your cookie choices have been saved.";
  returnFocus?.focus({ preventScroll: true });
  // Unload already-running third-party scripts after consent is withdrawn.
  if (revoked) location.reload();
}
function openPreferences() {
  preferences.hidden = false;
  analytics.checked = choice.analytics;
  marketing.checked = choice.marketing;
  manage.hidden = true;
  manage.setAttribute("aria-expanded", "true");
  save.hidden = false;
}
settings.hidden = false;
settings.addEventListener("click", () => {
  returnFocus = settings;
  banner.hidden = false;
  openPreferences();
  document.getElementById("cookie-title")?.focus({ preventScroll: true });
});
manage.addEventListener("click", () => { openPreferences(); analytics.focus(); });
document.querySelector("[data-cookie-accept]")!.addEventListener("click", () => choose({ analytics: true, marketing: true }));
document.querySelector("[data-cookie-reject]")!.addEventListener("click", () => choose({ analytics: false, marketing: false }));
save.addEventListener("click", () => choose({ analytics: analytics.checked, marketing: marketing.checked }));
const saved = readChoice();
if (saved) { choice = saved; loadTags(choice); clearOptionalCookies(choice); }
else { clearOptionalCookies(choice); banner.hidden = false; }
window.addEventListener("storage", (event) => { if (event.key === storageKey) location.reload(); });
