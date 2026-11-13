const page = document.querySelector<HTMLElement>("[data-christmas-page]");
const snow = page?.querySelector<HTMLElement>("[data-christmas-snow]");
const toggle = page?.querySelector<HTMLButtonElement>("[data-snow-toggle]");

if (page && snow && toggle) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  let pageActive = true;
  const menu = document.getElementById("festive-menu");
  // Use a stable text colour instead of blending letters with photograph pixels.
  const updateControlTone = () => {
    const button = toggle.getBoundingClientRect();
    const surface = menu?.getBoundingClientRect();
    const centre = button.top + button.height / 2;
    toggle.dataset.snowSurface = surface && centre >= surface.top && centre <= surface.bottom ? "light" : "dark";
  };
  let toneFrame = 0;
  const scheduleControlTone = () => {
    if (toneFrame) return;
    toneFrame = requestAnimationFrame(() => { toneFrame = 0; updateControlTone(); });
  };
  const sync = () => {
    const disabled = reducedMotion.matches;
    snow.hidden = disabled;
    toggle.hidden = disabled;
    const running = !disabled && !userPaused && pageActive && !document.hidden;
    page.dataset.snowRunning = String(running);
    toggle.textContent = userPaused ? "Resume snowfall" : "Pause snowfall";
    updateControlTone();
  };
  const resize = new ResizeObserver(() => {
    snow.style.setProperty("--snow-travel", `${snow.clientHeight + 24}px`);
    updateControlTone();
  });
  resize.observe(snow);
  document.addEventListener("scroll", scheduleControlTone, { passive: true });
  toggle.addEventListener("click", () => { userPaused = !userPaused; sync(); });
  reducedMotion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pagehide", () => { pageActive = false; sync(); });
  window.addEventListener("pageshow", () => { pageActive = true; sync(); });
  sync();
}

export {};
