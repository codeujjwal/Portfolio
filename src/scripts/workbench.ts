/**
 * The workbench: shipped work as objects on a cutting mat.
 * Without JavaScript (or with reduced motion) the objects sit in a tidy grid and
 * each one opens its story. With JavaScript, Matter.js is loaded just before the
 * desk scrolls into view; the objects drop onto the mat when you reach it, and
 * you can drag, throw and tap them. The headline is a solid body they bounce off.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, rand, reduce, getLenis } from './common';

type DeskItem = { id: string; k: string; t: string; role: string; body: string; did: string[]; stack: string[]; url?: string; live?: boolean };
type Item = { el: HTMLElement; body: any; w: number; h: number; s: number; o: number; bound?: boolean };

export function initWorkbench() {
  const desk = $('#desk');
  if (!desk) return;
  const data: DeskItem[] = JSON.parse($('#deskData')?.textContent || '[]');
  const byId = Object.fromEntries(data.map((d) => [d.id, d]));
  const objs = $$<HTMLButtonElement>('.obj', desk);

  drawQR();
  setupSheet(byId);

  // no physics: every object is a button that opens its story
  objs.forEach((el) => el.addEventListener('click', (e) => { if (!desk.classList.contains('live')) { e.preventDefault(); openSheet(el.dataset.id!); } }));
  if (reduce) return;

  let started = false;
  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || started) return;
    started = true; io.disconnect();
    try {
      const Matter = (await import('matter-js')).default;
      live(Matter, desk, objs);
    } catch (err) { console.error('[codeujjwal] workbench physics failed', err); }
  }, { rootMargin: '900px 0px' });
  io.observe(desk);
}

/* ---------- drawings ---------- */
function drawQR() {
  // decorative pattern with finder squares; not a scannable code
  $$<HTMLCanvasElement>('.qrc').forEach((c) => {
    const x = c.getContext('2d')!, n = 25;
    x.fillStyle = '#fff'; x.fillRect(0, 0, n, n); x.fillStyle = '#16201B';
    let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (r() > 0.52) x.fillRect(i, j, 1, 1);
    const finder = (fx: number, fy: number) => { x.fillStyle = '#fff'; x.fillRect(fx - 1, fy - 1, 9, 9); x.fillStyle = '#16201B'; x.fillRect(fx, fy, 7, 7); x.fillStyle = '#fff'; x.fillRect(fx + 1, fy + 1, 5, 5); x.fillStyle = '#16201B'; x.fillRect(fx + 2, fy + 2, 3, 3); };
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  });
}
function rulers(desk: HTMLElement) {
  const rx = $('#rx'), ry = $('#ry');
  if (!rx || !ry) return;
  rx.textContent = ''; ry.textContent = '';
  for (let px = 120, cm = 5; px < desk.clientWidth; px += 120, cm += 5) { const s = document.createElement('span'); s.className = 'rn'; s.style.left = px + 'px'; s.textContent = String(cm); rx.appendChild(s); }
  for (let px = 120, cm = 5; px < desk.clientHeight; px += 120, cm += 5) { const s = document.createElement('span'); s.className = 'rn'; s.style.top = px + 'px'; s.textContent = String(cm); ry.appendChild(s); }
}

/* ---------- story sheet ---------- */
let openSheet: (id: string) => void = () => {};
function setupSheet(byId: Record<string, DeskItem>) {
  const sheet = $<HTMLDialogElement>('#sheet');
  if (!sheet) return;
  const mobile = () => innerWidth <= 860;
  let openedAt = 0;
  const fill = (sel: string, items: string[]) => { const ul = $(sel)!; ul.textContent = ''; ul.hidden = !items.length; items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }); };
  openSheet = (id) => {
    const w = byId[id]; if (!w) return;
    $('#sh-k')!.textContent = w.k; $('#sh-title')!.textContent = w.t; $('#sh-role')!.textContent = w.role; $('#sh-body')!.textContent = w.body;
    fill('#sh-did', w.did); fill('#sh-stack', w.stack);
    const go = $<HTMLAnchorElement>('#sh-go')!;
    if (w.url && w.live) {
      const host = new URL(w.url).hostname.replace(/^www\./, '');
      go.href = w.url; go.hidden = false;
      go.textContent = host === 'play.google.com' ? 'Get it on Google Play ↗' : `Visit ${host} ↗`;
    } else go.hidden = true;
    if (!sheet.open) sheet.showModal();
    openedAt = performance.now();
    getLenis()?.stop();
    if (!reduce) {
      gsap.fromTo(sheet, mobile() ? { yPercent: 100, xPercent: 0 } : { xPercent: 100, yPercent: 0 }, { xPercent: 0, yPercent: 0, duration: 0.75, ease: 'expo.out' });
      gsap.from($$('.sheet-in > *:not(.sheet-x)'), { y: 18, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05, delay: 0.12 });
    }
  };
  const close = () => {
    const done = () => { sheet.close(); getLenis()?.start(); };
    if (reduce) return done();
    gsap.to(sheet, { ...(mobile() ? { yPercent: 100 } : { xPercent: 100 }), duration: 0.5, ease: 'expo.in', onComplete: done });
  };
  $('#shClose')?.addEventListener('click', close);
  sheet.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  // a tap's synthetic click lands on the backdrop right after the sheet opens; ignore that one
  sheet.addEventListener('click', (e) => { if (e.target === sheet && performance.now() - openedAt > 450) close(); });
}

/* ---------- physics ---------- */
function live(Matter: any, desk: HTMLElement, objs: HTMLElement[]) {
  const M = Matter;
  const copy = $('#deskCopy')!;
  let engine: any, items: Item[] = [], running = false, scaleK = 1, dropped = false, z = 10;

  desk.classList.add('live');
  objs.forEach((el) => { el.style.opacity = '0'; });
  gsap.set('.desk-copy > *', { opacity: 0, y: 30 });

  const rel = (el: Element) => { const a = el.getBoundingClientRect(), b = desk.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };
  const hitsCopy = (x: number, y: number, w: number, h: number, c: ReturnType<typeof rel>) => x + w / 2 > c.x - 16 && x - w / 2 < c.x + c.w + 16 && y + h / 2 > c.y - 16 && y - h / 2 < c.y + c.h + 16;

  function chooseScale() {
    const W = desk.clientWidth;
    scaleK = W < 520 ? 0.66 : W < 860 ? 0.8 : W < 1200 ? 0.9 : 1;
    objs.forEach((el) => {
      el.style.width = `calc(var(--w) * ${scaleK})`; el.style.height = `calc(var(--h) * ${scaleK})`;
      const inner = el.querySelector<HTMLElement>('.o-in')!;
      Object.assign(inner.style, { transform: `scale(${scaleK})`, transformOrigin: '0 0', width: `calc(100% / ${scaleK})`, height: `calc(100% / ${scaleK})` });
      // on phones the desk keeps every product with a link and drops the internal tool
      el.hidden = W < 520 && ['ledger'].includes(el.dataset.id!);
    });
  }

  function build() {
    const W = desk.clientWidth, H = desk.clientHeight, T = 400;
    if (!engine) engine = M.Engine.create({ gravity: { x: 0, y: 0 }, enableSleeping: true });
    M.Composite.clear(engine.world, false);
    const c = rel(copy);
    M.Composite.add(engine.world, [
      M.Bodies.rectangle(W / 2, -T / 2 + 30, W + T * 2, T, { isStatic: true }),
      M.Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true }),
      M.Bodies.rectangle(-T / 2 + 30, H / 2, T, H + T * 2, { isStatic: true }),
      M.Bodies.rectangle(W + T / 2, H / 2, T, H + T * 2, { isStatic: true }),
      M.Bodies.rectangle(c.x + c.w / 2, c.y + c.h / 2, c.w + 20, c.h + 20, { isStatic: true, chamfer: { radius: 12 } }),
    ]);
    const old = new Map(items.map((it) => [it.el, it]));
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const ordered = objs.filter((el) => !el.hidden).sort((a, b) => Number(b.classList.contains('is-live')) - Number(a.classList.contains('is-live')));
    items = ordered.map((el) => {
      const w = el.offsetWidth, h = el.offsetHeight, prev = old.get(el);
      let x: number, y: number, a: number;
      if (prev) {
        x = Math.min(Math.max(prev.body.position.x, w / 2 + 34), W - w / 2 - 4);
        y = Math.min(Math.max(prev.body.position.y, h / 2 + 34), H - h / 2 - 4);
        a = prev.body.angle;
      } else {
        let tries = 0;
        do { x = rand(40 + w / 2, W - 10 - w / 2); y = rand(76 + h / 2, H - 10 - h / 2); tries++; }
        while (tries < 300 && (hitsCopy(x, y, w, h, c) || placed.some((p) => Math.abs(p.x - x) < ((p.w + w) / 2) * 0.92 && Math.abs(p.y - y) < ((p.h + h) / 2) * 0.92)));
        a = (parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || rand(-12, 12)) * (Math.PI / 180);
      }
      placed.push({ x, y, w, h });
      const body = M.Bodies.rectangle(x, y, w, h, { angle: a, frictionAir: 0.085, friction: 0.25, restitution: 0.32, density: 0.0016, chamfer: { radius: 8 * scaleK } });
      M.Composite.add(engine.world, body);
      const it: Item = { el, body, w, h, s: prev ? prev.s : 1.35, o: prev ? prev.o : 0, bound: prev?.bound };
      return it;
    });
    bindDrag();
  }

  function bindDrag() {
    items.forEach((it) => {
      if (it.bound) return; it.bound = true;
      const el = it.el;
      let con: any = null, sx = 0, sy = 0, st = 0, moved = 0, hold = 0, pending: PointerEvent | null = null;
      const pt = (e: PointerEvent) => { const r = desk.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      const cur = () => items.find((i) => i.el === el);
      const grab = (e: PointerEvent) => {
        const c = cur(); if (!c) return;
        const p = pt(e);
        M.Sleeping.set(c.body, false);
        con = M.Constraint.create({ pointA: p, bodyB: c.body, pointB: { x: p.x - c.body.position.x, y: p.y - c.body.position.y }, stiffness: 0.18, damping: 0.08, length: 0 });
        M.Composite.add(engine.world, con);
        el.classList.add('lifted'); el.style.zIndex = String(++z);
      };
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        sx = e.clientX; sy = e.clientY; st = performance.now(); moved = 0;
        el.setPointerCapture(e.pointerId);
        if (e.pointerType === 'touch') {
          // on touch, a short hold picks the card up so the page can still scroll
          pending = e;
          hold = window.setTimeout(() => { if (pending) { grab(pending); pending = null; navigator.vibrate?.(8); } }, 220);
        } else { e.preventDefault(); grab(e); }
      });
      el.addEventListener('pointermove', (e) => {
        moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
        if (pending && moved > 8) { clearTimeout(hold); pending = null; el.releasePointerCapture?.(e.pointerId); return; }
        if (con) con.pointA = pt(e);
      });
      el.addEventListener('touchmove', (e) => { if (con) e.preventDefault(); }, { passive: false });
      const up = () => {
        clearTimeout(hold);
        pending = null;
        if (con) {
          const c = cur();
          M.Composite.remove(engine.world, con); con = null; el.classList.remove('lifted');
          if (c) { const v = c.body.velocity, sp = Math.hypot(v.x, v.y), max = 38; if (sp > max) M.Body.setVelocity(c.body, { x: (v.x / sp) * max, y: (v.y / sp) * max }); }
        }
        if (moved < 6 && performance.now() - st < 450) openSheet(el.dataset.id!);
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', () => { clearTimeout(hold); pending = null; if (con) { M.Composite.remove(engine.world, con); con = null; el.classList.remove('lifted'); } });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(el.dataset.id!); } });
      el.addEventListener('click', (e) => e.preventDefault());
    });
  }

  let acc = 0, last = performance.now();
  function step(t: number) {
    if (running) {
      acc += Math.min(50, t - last);
      while (acc >= 1000 / 60) { M.Engine.update(engine, 1000 / 60); acc -= 1000 / 60; }
      for (const it of items) {
        const { x, y } = it.body.position;
        it.el.style.transform = `translate3d(${(x - it.w / 2).toFixed(1)}px, ${(y - it.h / 2).toFixed(1)}px, 0) rotate(${it.body.angle.toFixed(4)}rad) scale(${it.s.toFixed(3)})`;
        it.el.style.opacity = String(it.o);
        if (it.s > 1.001) it.el.style.setProperty('--lift', ((it.s - 1) / 0.35).toFixed(3));
      }
    }
    last = t;
    requestAnimationFrame(step);
  }

  function dropIn() {
    if (dropped) return; dropped = true;
    items.forEach((it, i) => {
      gsap.timeline({ delay: 0.1 + i * 0.085 })
        .to(it, { o: 1, duration: 0.2, ease: 'none' }, 0)
        .to(it, { s: 0.985, duration: 0.5, ease: 'power2.in' }, 0)
        .add(() => { it.el.style.removeProperty('--lift'); M.Sleeping.set(it.body, false); M.Body.setAngularVelocity(it.body, rand(-0.03, 0.03)); M.Body.setVelocity(it.body, { x: rand(-2, 2), y: rand(-2, 2) }); })
        .to(it, { s: 1, duration: 0.35, ease: 'back.out(3)' });
    });
    gsap.to('.desk-copy > *', { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08 });
  }

  chooseScale(); rulers(desk); build();
  requestAnimationFrame(step);
  ScrollTrigger.create({ trigger: desk, start: 'top bottom', end: 'bottom top', onToggle: (s) => { running = s.isActive; last = performance.now(); } });
  ScrollTrigger.create({ trigger: desk, start: 'top 65%', once: true, onEnter: dropIn });
  ScrollTrigger.refresh();
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { chooseScale(); rulers(desk); build(); }, 150); });
}
