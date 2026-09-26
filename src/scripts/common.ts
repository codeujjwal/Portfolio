import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** IST clocks and the postmark date anywhere on the page. */
function clocks() {
  const tz = { timeZone: 'Asia/Kolkata' } as const;
  const time = new Intl.DateTimeFormat('en-GB', { ...tz, hour: '2-digit', minute: '2-digit', hour12: false });
  const date = new Intl.DateTimeFormat('en-GB', { ...tz, day: '2-digit', month: 'short', year: 'numeric' });
  const tick = () => {
    const d = new Date();
    $$('.ist').forEach((el) => (el.textContent = time.format(d)));
    $$('.pm-time').forEach((el) => (el.textContent = time.format(d) + ' IST'));
    $$('.pm-date').forEach((el) => (el.textContent = date.format(d).toUpperCase()));
  };
  tick();
  setInterval(tick, 15000);
}

/** Smooth scroll, synced to GSAP's ticker so ScrollTrigger never drifts. */
function smooth() {
  if (reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToTarget(el: Element | number) {
  const off = typeof el === 'number' || (el as HTMLElement).id === 'top' ? 0 : -64;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: off, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (typeof el === 'number') window.scrollTo({ top: el });
  else (el as HTMLElement).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Arriving on /#contact (say, from the resume page): the page keeps changing
 * height for a moment while fonts load and the workbench wakes up, so hold the
 * target in place until the layout settles or the visitor scrolls.
 */
function landOnHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const off = id === 'top' ? 0 : -64;
  const go = () => {
    const y = Math.max(0, el.getBoundingClientRect().top + scrollY + off);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
  };
  go();
  const ro = new ResizeObserver(() => go());
  ro.observe(document.body);
  const stop = () => { ro.disconnect(); ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => removeEventListener(t, stop)); };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, stop, { passive: true }));
  setTimeout(stop, 3000);
}

/** In-page anchors (#id and /#id on the home page) scroll smoothly. */
function anchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const onHome = location.pathname === '/' || location.pathname === '/index.html';
    let id = '';
    if (href.startsWith('#')) id = href.slice(1);
    else if (href.startsWith('/#') && onHome) id = href.slice(2);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
    history.replaceState(null, '', '#' + id);
  });
}

/** Full-screen menu for small screens. */
let menuOpen = false;
function closeMenu() { if (menuOpen) toggleMenu(false); }
function toggleMenu(open: boolean) {
  const btn = $('#menuBtn'), ov = $('#overlay');
  if (!btn || !ov) return;
  menuOpen = open;
  document.body.classList.toggle('menu-open', open);
  btn.setAttribute('aria-expanded', String(open));
  ov.setAttribute('aria-hidden', String(!open));
  const links = $$('a', ov);
  links.forEach((l) => (l.tabIndex = open ? 0 : -1));
  if (open) lenis?.stop(); else lenis?.start();
  if (reduce) {
    ov.style.visibility = open ? 'visible' : 'hidden';
    ov.style.clipPath = open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)';
  } else if (open) {
    gsap.set(ov, { visibility: 'visible' });
    gsap.to(ov, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' });
    gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 });
  } else {
    gsap.to(ov, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(ov, { visibility: 'hidden' }) });
  }
  if (open) links[0]?.focus();
}
function menu() {
  const btn = $('#menuBtn');
  btn?.addEventListener('click', () => toggleMenu(!menuOpen));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { toggleMenu(false); btn?.focus(); } });
  $$('#overlay a').forEach((a) => a.addEventListener('click', () => { if (!a.getAttribute('href')?.includes('#')) closeMenu(); }));
}

/** A small signal-orange square that follows the pointer and names what a click will do. */
function cursor() {
  if (!finePointer || reduce) return;
  const c = $('#cursor');
  if (!c) return;
  const lab = $('.lab', c)!;
  let x = -100, y = -100, cx = x, cy = y, shown = false;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; if (!shown) { shown = true; c.style.opacity = '1'; cx = x; cy = y; } }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { c.style.opacity = '0'; shown = false; });
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    if (t) { lab.textContent = t.dataset.cursor || ''; c.classList.add('on'); } else c.classList.remove('on');
  });
  gsap.ticker.add(() => {
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
    c.style.transform = `translate3d(${cx + 14}px, ${cy + 14}px, 0)`;
  });
}

/** Top bar: hairline once you leave the top, orange progress along the bottom edge. */
function bar() {
  const top = $('#topbar');
  const prog = $('#progress');
  const onScroll = () => {
    const y = window.scrollY;
    top?.classList.toggle('scrolled', y > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

export function copyButton(btnSel: string, textSel: string) {
  const btn = $(btnSel), src = $(textSel);
  if (!btn || !src) return;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(src.textContent || ''); btn.textContent = 'Copied'; }
    catch { const r = document.createRange(); r.selectNodeContents(src); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); btn.textContent = 'Selected'; }
    setTimeout(() => (btn.textContent = 'Copy'), 1800);
  });
}

export function initCommon() {
  clocks();
  smooth();
  landOnHash();
  anchors();
  menu();
  cursor();
  bar();
}
