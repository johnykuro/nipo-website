import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

export function initGalleryRail(rail: HTMLElement): () => void {
  gsap.registerPlugin(Draggable);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups: (() => void)[] = [];
  const on = (target: EventTarget, type: string, handler: EventListener) => {
    target.addEventListener(type, handler);
    cleanups.push(() => target.removeEventListener(type, handler));
  };
  const observeVisibility = (element: Element, callback: (visible: boolean) => void) => {
    const observer = new IntersectionObserver(([entry]) => callback(entry.isIntersecting), { threshold: .05 });
    observer.observe(element);
    cleanups.push(() => observer.disconnect());
  };
  const track = rail.querySelector<HTMLElement>("[data-gallery-track]")!;
  const items = [...track.querySelectorAll<HTMLAnchorElement>("a")];
  const originals = items.filter(item => !item.dataset.duplicate);
  let span = 1, x = 0, dragging = false, hovered = rail.matches(":hover"), focused = rail.contains(document.activeElement), visible = false;
  let suppressClickUntil = 0;
  rail.classList.add("is-enhanced");
  const wrap = (value: number) => ((value % span) + span) % span - span;
  const measure = () => {
    span = Math.max(1, items[originals.length].offsetLeft - items[0].offsetLeft);
    const active = focused ? document.activeElement?.closest<HTMLAnchorElement>("a") : null;
    x = active && rail.contains(active) ? -active.offsetLeft + 24 : wrap(x);
    gsap.set(track, { x });
  };
  measure();
  const resize = new ResizeObserver(measure); resize.observe(rail); cleanups.push(() => resize.disconnect());
  const [drag] = Draggable.create(track, {
    type:"x", trigger:rail, allowNativeTouchScrolling:true, minimumMovement:6,
    onPress() { dragging = true; x = Number(gsap.getProperty(track, "x")); this.update(); },
    onDrag() { x = this.x; },
    onDragEnd() { suppressClickUntil = performance.now() + 120; },
    onRelease() { dragging = false; x = wrap(this.x); gsap.set(track, { x }); this.update(); }
  });
  const tick = (_time: number, delta: number) => {
    if (dragging || hovered || focused || !visible || reduced.matches || document.hidden || document.querySelector("dialog[open]")) return;
    x = wrap(x - Math.min(delta, 50) * .027); gsap.set(track, { x });
  };
  gsap.ticker.add(tick); cleanups.push(() => { gsap.ticker.remove(tick); drag.kill(); });
  on(rail, "click", ((event: MouseEvent) => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }) as EventListener);
  on(rail, "mouseenter", () => { hovered = true; }); on(rail, "mouseleave", () => { hovered = false; });
  const revealFocusedItem = (target: Element | null) => {
    const item = target?.closest<HTMLAnchorElement>("a");
    if (item) { x = -item.offsetLeft + 24; gsap.set(track, { x }); drag.update(); }
  };
  on(rail, "focusin", ((event: FocusEvent) => {
    focused = true;
    revealFocusedItem(event.target as Element);
  }) as EventListener);
  on(rail, "focusout", () => { queueMicrotask(() => { focused = rail.contains(document.activeElement); }); });
  // Focus may have triggered the async import before these listeners existed.
  if (focused) revealFocusedItem(document.activeElement);
  observeVisibility(rail, value => { visible = value; });

  return () => {
    cleanups.forEach(cleanup => cleanup());
    rail.classList.remove("is-enhanced");
    gsap.set(track, { clearProps: "transform" });
  };
}
