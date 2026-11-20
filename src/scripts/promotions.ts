import { blackFridayPromotion } from "../config/promotions";
import { homepagePromotion, isBlackFridayActive } from "./promotion-schedule";

const banner = document.querySelector<HTMLElement>("[data-campaign-banner]");
const promo = document.querySelector<HTMLElement>("[data-set-menu-promo]");
const offers = promo?.querySelectorAll<HTMLElement>("[data-promo-offer]");
const closeButton = promo?.querySelector<HTMLButtonElement>("[data-set-menu-dismiss]");
const cookieBanner = document.querySelector<HTMLElement>("[data-cookie-banner]");
// Each offer is dismissed only for this page load. The next offer starts fresh.
const dismissed = new Set<string>();
let ready = false;
let currentOffer: ReturnType<typeof homepagePromotion> = null;
let cookieWasOpen = !!cookieBanner && !cookieBanner.hidden;

const updateBannerHeight = () => {
  const height = banner && !banner.hidden ? banner.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty("--promo-banner-height", `${height}px`);
};

const releaseFocus = (surface: HTMLElement | null = promo) => {
  if (!surface?.contains(document.activeElement)) return;
  const main = document.querySelector<HTMLElement>("#main-content");
  if (!main) return;
  const originalTabindex = main.getAttribute("tabindex");
  main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll:true });
  main.addEventListener("blur", () => {
    if (originalTabindex === null) main.removeAttribute("tabindex");
    else main.setAttribute("tabindex", originalTabindex);
  }, { once:true });
};

const update = () => {
  const now = new Date();
  if (banner) {
    const expired = !isBlackFridayActive(now);
    if (expired) releaseFocus(banner);
    banner.hidden = expired;
    updateBannerHeight();
  }
  if (!promo) return;

  const nextOffer = homepagePromotion(now);
  const occupied = document.querySelector("dialog[open], [data-cookie-banner]:not([hidden])");
  const hidden = !nextOffer || dismissed.has(nextOffer) || !ready || !!occupied || document.visibilityState !== "visible";
  if (currentOffer !== nextOffer || hidden) releaseFocus();
  currentOffer = nextOffer;
  offers?.forEach(offer => { offer.hidden = offer.dataset.promoOffer !== currentOffer; });
  promo.classList.toggle("set-menu-promo--black-friday", currentOffer === "black-friday");
  if (currentOffer) {
    promo.setAttribute("aria-labelledby", `${currentOffer}-promo-title`);
    closeButton?.setAttribute("aria-label", currentOffer === "black-friday" ? "Dismiss Black Friday promotion" : "Dismiss set menu promotion");
  }
  promo.hidden = hidden;
};

const dismiss = () => {
  if (currentOffer) dismissed.add(currentOffer);
  update();
};

closeButton?.addEventListener("click", dismiss);
promo?.querySelectorAll("a").forEach(link => link.addEventListener("click", dismiss));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && promo && !promo.hidden) dismiss();
});
document.addEventListener("visibilitychange", update);
window.addEventListener("pageshow", update);

if (banner) new ResizeObserver(updateBannerHeight).observe(banner);
if (promo) {
  const observer = new MutationObserver(() => {
    // Cookie choices take priority; reveal immediately once they are finished.
    if (cookieWasOpen && cookieBanner?.hidden) ready = true;
    cookieWasOpen = !!cookieBanner && !cookieBanner.hidden;
    update();
  });
  document.querySelectorAll("dialog, [data-cookie-banner]").forEach(element => {
    observer.observe(element, { attributes:true, attributeFilter:["open", "hidden"] });
  });
  window.setTimeout(() => { ready = true; update(); }, 1000);
}

update();
// Continue checking after dismissal so expiry can restore the set menu offer.
const scheduleCheck = () => {
  window.setTimeout(() => { update(); scheduleCheck(); }, 60_000 - (Date.now() % 60_000));
};
scheduleCheck();
// Hit the campaign cutoff precisely even if the minute timer was delayed.
const untilExpiry = Date.parse(blackFridayPromotion.endsAt) - Date.now();
if (untilExpiry > 0 && untilExpiry <= 2_147_483_647) window.setTimeout(update, untilExpiry);
