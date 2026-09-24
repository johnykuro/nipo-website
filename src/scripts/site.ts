import { gsap } from "gsap";
document.documentElement.classList.add("js");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const cleanups: (() => void)[] = [];
const on = (target: EventTarget, type: string, handler: EventListener) => {
  target.addEventListener(type, handler);
  cleanups.push(() => target.removeEventListener(type, handler));
};
const observeVisibility = (element: Element, callback: (visible: boolean) => void) => {
  const observer = new IntersectionObserver(([entry]) => callback(entry.isIntersecting), { threshold: .05 });
  observer.observe(element); cleanups.push(() => observer.disconnect());
};
const header = document.querySelector<HTMLElement>("[data-site-header]");
document.querySelectorAll<HTMLDialogElement>("dialog").forEach(dialog => {
  on(dialog, "keydown", ((event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex="0"]')]
      .filter(el => el.offsetParent !== null && !el.hasAttribute("disabled"));
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }) as EventListener);
});
const updateHeader = () => header?.classList.toggle("is-scrolled", scrollY > 30);
on(window, "scroll", updateHeader); updateHeader();

const menu = document.querySelector<HTMLDialogElement>("[data-mobile-menu]");
const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
if (menu && toggle) {
  on(toggle, "click", () => { menu.showModal(); toggle.setAttribute("aria-expanded", "true"); document.dispatchEvent(new Event("nipo:dialog")); });
  on(menu.querySelector("[data-menu-close]")!, "click", () => menu.close());
  on(menu, "close", () => { toggle.setAttribute("aria-expanded", "false"); toggle.focus(); document.dispatchEvent(new Event("nipo:dialog")); });
  on(menu, "click", ((event: MouseEvent) => {
    if ((event.target as Element).closest("a")) menu.close();
  }) as EventListener);
}

// Keep the first photograph and all navigation available if enhancement cannot run.
document.querySelectorAll<HTMLImageElement>(".photo img").forEach((img) => {
  const failed = () => img.closest(".photo")?.classList.add("is-failed");
  on(img, "error", failed);
  if (img.complete && !img.naturalWidth) failed();
});

const hero = document.querySelector<HTMLElement>("[data-hero]");
if (hero) {
  const slides = [...hero.querySelectorAll<HTMLElement>("[data-hero-slide]")];
  const controls = hero.querySelector<HTMLElement>("[data-slideshow-controls]")!;
  const pause = hero.querySelector<HTMLButtonElement>("[data-hero-pause]")!;
  const count = hero.querySelector<HTMLElement>("[data-hero-count]")!;
  const video = hero.querySelector<HTMLVideoElement>("video");
  let current = 0, userPaused = false, hovered = false, focused = false, visible = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let preloadTimer: ReturnType<typeof setTimeout> | undefined;
  let request = 0;
  const prepared = new Map<number, Promise<boolean>>();
  const prepare = (index: number): Promise<boolean> => {
    const next = (index + slides.length) % slides.length;
    const existing = prepared.get(next);
    if (existing) return existing;
    const slide = slides[next];
    const template = slide.querySelector<HTMLTemplateElement>("[data-hero-photo]");
    if (template) {
      const fragment = template.content.cloneNode(true) as DocumentFragment;
      const img = fragment.querySelector("img")!;
      img.loading = "eager";
      img.fetchPriority = "low";
      on(img, "error", () => img.closest(".photo")?.classList.add("is-failed"));
      template.replaceWith(fragment);
    }
    const img = slide.querySelector<HTMLImageElement>("img")!;
    const ready = img.decode().then(() => true, () => false);
    prepared.set(next, ready);
    return ready;
  };
  let zoom: gsap.core.Tween | undefined;
  let playingVideo = false;
  const blocked = () => reduced.matches || userPaused || hovered || focused || !visible || document.hidden || !!document.querySelector("dialog[open]");
  const update = () => {
    clearTimeout(timer);
    clearTimeout(preloadTimer);
    const stopped = blocked();
    hero.dataset.paused = String(stopped);
    pause.textContent = userPaused ? "Play" : "Pause";
    pause.setAttribute("aria-pressed", String(userPaused));
    pause.setAttribute("aria-label", (userPaused ? "Play " : "Pause ") + (playingVideo ? "video" : "slideshow"));
    if (stopped) { zoom?.pause(); video?.pause(); }
    else {
      zoom?.resume();
      if (playingVideo) void video?.play().catch(() => {});
      else {
        const interval = Number(hero.dataset.interval) || 7000;
        // Prepare only the upcoming photograph, shortly before its transition.
        preloadTimer = setTimeout(() => { void prepare(current + 1); }, Math.max(0, interval - 2500));
        timer = setTimeout(() => { void show(current + 1, true); }, interval);
      }
    }
  };
  const animatePhoto = () => {
    zoom?.kill();
    gsap.set(slides[current].querySelector(".photo"), { scale: 1 });
    if (!reduced.matches) zoom = gsap.fromTo(slides[current].querySelector(".photo"), { scale:1 }, { scale:1.055, duration:9, ease:"none" });
  };
  const commit = (next: number) => {
    current = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      gsap.to(slide, { opacity:i === current ? 1 : 0, duration:reduced.matches ? 0 : 1.2, overwrite:true });
    });
    hero.dataset.slide = String(current);
    count.textContent = String(current + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    animatePhoto(); update();
  };
  const show = async (index: number, automatic = false) => {
    const pending = ++request;
    clearTimeout(timer);
    clearTimeout(preloadTimer);
    let next = (index + slides.length) % slides.length;
    // Keep the current photograph visible while loading, and skip failed media.
    for (let attempt = 0; attempt < slides.length; attempt++) {
      const ready = await prepare(next);
      if (pending !== request) return;
      if (automatic && blocked()) { update(); return; }
      if (ready) { commit(next); return; }
      next = (next + 1) % slides.length;
    }
    update();
  };
  controls.hidden = false;
  on(hero.querySelector("[data-hero-prev]")!, "click", () => show(current - 1));
  on(hero.querySelector("[data-hero-next]")!, "click", () => show(current + 1));
  on(pause, "click", () => { userPaused = !userPaused; update(); });
  on(controls, "mouseenter", () => { hovered = true; update(); });
  on(controls, "mouseleave", () => { hovered = false; update(); });
  on(hero, "focusin", () => { focused = true; update(); });
  on(hero, "focusout", () => { queueMicrotask(() => { focused = hero.contains(document.activeElement); update(); }); });
  on(document, "visibilitychange", update);
  on(document, "nipo:dialog", update);
  on(reduced, "change", () => {
    if (video && reduced.matches) { video.pause(); playingVideo = false; gsap.set(video, { opacity:0 }); }
    animatePhoto(); update();
  });
  observeVisibility(hero, (value) => { visible = value; update(); });
  commit(0);
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (video && hero.dataset.videoSrc && !reduced.matches && !connection?.saveData) {
    video.src = hero.dataset.videoSrc;
    on(video, "playing", () => {
      playingVideo = true; gsap.to(video, { opacity:1 }); clearTimeout(timer); clearTimeout(preloadTimer); request++;
      controls.querySelectorAll<HTMLElement>("[data-hero-prev], [data-hero-next], [data-hero-count]").forEach(el => el.hidden = true);
    });
    on(video, "error", () => {
      playingVideo = false; gsap.set(video, { opacity:0 });
      controls.querySelectorAll<HTMLElement>("[data-hero-prev], [data-hero-next], [data-hero-count]").forEach(el => el.hidden = false);
      update();
    });
    void video.play().catch(() => { playingVideo = false; update(); });
  }
  cleanups.push(() => { request++; clearTimeout(timer); clearTimeout(preloadTimer); zoom?.kill(); video?.pause(); });
}

// Menu links remain regular links; hover and keyboard focus only change the preview.
const menuLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-menu-preview]")];
const menuImages = [...document.querySelectorAll<HTMLElement>("[data-menu-image]")];
menuLinks.forEach((link, index) => {
  const preview = () => {
    menuLinks.forEach((item, i) => item.classList.toggle("is-active", i === index));
    menuImages.forEach((item, i) => { item.classList.toggle("is-active", i === index); gsap.to(item, { opacity:i === index ? 1 : 0, duration:reduced.matches ? 0 : .55, overwrite:true }); });
  };
  on(link, "mouseenter", preview); on(link, "focus", preview);
});

const rail = document.querySelector<HTMLElement>("[data-gallery-rail]");
if (rail) {
  let loading = false, disposed = false;
  const enhance = async () => {
    if (loading || disposed) return;
    loading = true;
    try {
      const { initGalleryRail } = await import("./gallery-rail");
      if (disposed) return;
      cleanups.push(initGalleryRail(rail));
      observer.disconnect();
    } catch {
      // Keep the native scrolling gallery usable if the enhancement cannot load.
      loading = false;
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) void enhance();
  }, { rootMargin: "300px" });
  observer.observe(rail);
  on(rail, "focusin", () => { void enhance(); });
  on(rail, "pointerenter", () => { void enhance(); });
  cleanups.push(() => { disposed = true; observer.disconnect(); });
}

const lightbox = document.querySelector<HTMLDialogElement>("[data-lightbox]");
if (lightbox) {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-lightbox-item]:not([data-duplicate])")];
  const image = lightbox.querySelector<HTMLImageElement>("[data-lightbox-image]")!;
  const caption = lightbox.querySelector<HTMLElement>("[data-lightbox-caption]")!;
  const count = lightbox.querySelector<HTMLElement>("[data-lightbox-count]")!;
  let index = 0, opener: HTMLElement | null = null;
  const change = (next: number) => {
    index = (next + links.length) % links.length;
    const link = links[index];
    image.src = link.href; image.alt = link.dataset.alt || "";
    caption.textContent = link.dataset.caption || "";
    count.textContent = String(index + 1).padStart(2,"0") + " / " + String(links.length).padStart(2,"0");
  };
  const notifyDialog = () => document.dispatchEvent(new Event("nipo:dialog"));
  on(document, "click", ((event: MouseEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("[data-lightbox-item]");
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); opener = link;
    change(links.findIndex(item => item.dataset.photoId === link.dataset.photoId));
    lightbox.showModal(); notifyDialog();
  }) as EventListener);
  on(lightbox.querySelector("[data-lightbox-close]")!, "click", () => lightbox.close());
  on(lightbox.querySelector("[data-lightbox-prev]")!, "click", () => change(index - 1));
  on(lightbox.querySelector("[data-lightbox-next]")!, "click", () => change(index + 1));
  on(lightbox, "keydown", ((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(index + (event.key === "ArrowLeft" ? -1 : 1)); }
  }) as EventListener);
  on(lightbox, "close", () => { opener?.focus({ preventScroll:true }); notifyDialog(); });
  on(image, "error", () => { caption.textContent = "This photograph could not load. Please try the next image."; });
  let startX = 0, startY = 0;
  on(image, "pointerdown", ((event: PointerEvent) => { startX = event.clientX; startY = event.clientY; }) as EventListener);
  on(image, "pointerup", ((event: PointerEvent) => {
    const dx = event.clientX - startX, dy = event.clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) change(index + (dx < 0 ? 1 : -1));
  }) as EventListener);
}
// Pause running media on cached page navigation, then restore naturally on return.
on(window, "pagehide", () => gsap.globalTimeline.pause());
on(window, "pageshow", () => gsap.globalTimeline.resume());
if (import.meta.hot) import.meta.hot.dispose(() => { cleanups.forEach(fn => fn()); gsap.killTweensOf("*"); });
