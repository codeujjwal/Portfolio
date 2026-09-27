import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { $, $$, clamp, reduce, finePointer, initCommon, getLenis, copyButton } from './common';
import { initVoice } from './voice';
import { initForm } from './form';
import { initWorkbench } from './workbench';

/** Run one feature; if it throws, log it and keep going so the rest of the page still moves. */
function safe(name: string, fn: () => void) {
  try { fn(); } catch (err) { console.error(`[codeujjwal] ${name} failed`, err); }
}

/* ---------- text effects ---------- */
const DIGITS = '0123456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Letters and digits flicker, then settle left to right. */
function scramble(el: HTMLElement, final: string, dur = 1200) {
  const start = performance.now();
  const f = (t: number) => {
    const p = Math.min(1, (t - start) / dur);
    el.textContent = [...final].map((c, i) => (/[0-9A-Za-z]/.test(c) && i / final.length > p ? (/\d/.test(c) ? DIGITS[(Math.random() * 10) | 0] : LETTERS[(Math.random() * 26) | 0]) : c)).join('');
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/** Only the digits roll, like an odometer. Works on every text node, so nested markup survives. */
function rollDigits(el: HTMLElement, dur = 900) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: { n: Text; final: string }[] = [];
  while (walker.nextNode()) { const n = walker.currentNode as Text; if (/\d/.test(n.data)) nodes.push({ n, final: n.data }); }
  if (!nodes.length) return;
  const total = nodes.reduce((a, b) => a + b.final.length, 0);
  const start = performance.now();
  const f = (t: number) => {
    const p = Math.min(1, (t - start) / dur);
    let seen = 0;
    for (const { n, final } of nodes) {
      n.data = [...final].map((c, i) => (/\d/.test(c) && (seen + i) / total > p ? DIGITS[(Math.random() * 10) | 0] : c)).join('');
      seen += final.length;
    }
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/** mm:ss timestamps count up from 00:00. */
function countTime(el: HTMLElement, dur = 1000) {
  const [m, s] = (el.textContent || '0:0').split(':').map(Number);
  const end = m * 60 + s, o = { v: 0 };
  gsap.to(o, { v: end, duration: dur / 1000, ease: 'expo.out', onUpdate: () => { const v = Math.round(o.v); el.textContent = `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`; } });
}

/* ---------- pointer toys ---------- */
/** CAD crosshair with a live X/Y readout over the hero. */
function crosshair() {
  if (!finePointer) return;
  const hero = $('#top'), hx = $('.hx'), hy = $('.hy'), ro = $('#readout');
  if (!hero || !hx || !hy || !ro) return;
  let x = 0, y = 0, cx = 0, cy = 0;
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; }, { passive: true });
  gsap.ticker.add(() => {
    if (Math.abs(x - cx) < 0.3 && Math.abs(y - cy) < 0.3) return;
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
    hx.style.transform = `translateY(${cy}px)`;
    hy.style.transform = `translateX(${cx}px)`;
    ro.style.transform = `translate(${cx + 12}px, ${cy + 12}px)`;
    ro.textContent = `X ${String(Math.round(cx)).padStart(4, '0')} · Y ${String(Math.round(cy)).padStart(4, '0')}`;
  });
}

/** Elements that lean toward the pointer. The parent is the hit area. */
function magnet(sel: string, strength = 0.35) {
  if (!finePointer) return;
  $$(sel).forEach((m) => {
    const area = m.parentElement!;
    const mx = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'elastic.out(1,.4)' });
    const my = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'elastic.out(1,.4)' });
    area.addEventListener('pointermove', (e) => { const r = m.getBoundingClientRect(); mx((e.clientX - (r.left + r.width / 2)) * strength); my((e.clientY - (r.top + r.height / 2)) * strength); });
    area.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

/** Index cards and the postcard tilt toward the pointer like paper in your hand. */
function tilt(sel: string, max = 8) {
  if (!finePointer) return;
  $$(sel).forEach((c) => {
    gsap.set(c, { transformPerspective: 900 });
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(c, 'rotationY', { duration: 0.8, ease: 'power3' });
    c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * max); rx(-((e.clientY - r.top) / r.height - 0.5) * max); });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/** The section label in the top bar follows you down the page. */
function sectionLabels() {
  const label = $('#secLabel');
  if (!label) return;
  const names: string[] = [];
  $$('[data-section]').forEach((s) => { const n = s.dataset.section!; if (!names.includes(n)) names.push(n); });
  let current = label.textContent || '';
  const set = (n: string) => {
    const text = `§ ${String(names.indexOf(n) + 1).padStart(2, '0')} · ${n}`;
    if (text === current) return;
    current = text;
    if (reduce) label.textContent = text; else scramble(label, text, 500);
  };
  $$('[data-section]').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 45%', end: 'bottom 45%', onToggle: (st) => st.isActive && set(s.dataset.section!) }));
}

/** Toolkit tapes run on their own and speed up (and follow direction) as you scroll. */
function tapes() {
  const lenis = getLenis();
  const rows = $$('.tape').map((el, i) => ({ el, dir: +(el.dataset.dir || -1), x: 0, w: 0, i }));
  const measure = () => rows.forEach((r) => { r.w = r.el.scrollWidth / 3; if (!r.x) r.x = -r.w * (0.2 + r.i * 0.27); });
  measure();
  addEventListener('resize', measure);
  let v = 0, heading = 1, skew = 0, active = false;
  lenis?.on('scroll', (l: { velocity: number }) => { v = l.velocity; if (Math.abs(v) > 0.2) heading = Math.sign(v); });
  ScrollTrigger.create({ trigger: '.toolkit', start: 'top bottom', end: 'bottom top', onToggle: (s) => (active = s.isActive) });
  gsap.ticker.add((_t, dt) => {
    if (!active) return;
    const k = dt / 16.7;
    const boost = Math.min(Math.abs(v) * 1.5, 70);
    skew += (clamp(-v * 0.35, -12, 12) - skew) * 0.12;
    v *= 0.9;
    for (const r of rows) {
      r.x += (1.2 + boost) * r.dir * heading * k;
      if (r.x <= -r.w) r.x += r.w;
      if (r.x > 0) r.x -= r.w;
      r.el.style.transform = `translate3d(${r.x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    }
  });
}

/** Everything else rises into place the first time it scrolls into view. */
function reveals() {
  const sel = [
    '.who', '.dep-strip > *', '.dep-left > p', '.shipped-wrap > .mono', '.fig span', '.dep-foot',
    '.edu-head .note', '.msg-side > h3', '.msg-side > p', '.cform > .field', '.cform > .topics', '.send-row',
    '.to > *', '.foot > *', '.kicker > span',
  ].join(',');
  const els = $$(sel);
  gsap.set(els, { opacity: 0, y: 26 });
  ScrollTrigger.batch(els, {
    start: 'clamp(top 92%)', once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'land', stagger: 0.06, overwrite: true }),
  });

  // numbers roll when they arrive
  $$('.dep-strip .no, .dep-strip .loc, .dep-strip .when, .roles li span:last-child, .icard > .mono, .kicker > span, .foot > span').forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: 'clamp(top 92%)', once: true, onEnter: () => rollDigits(el, 1000) }),
  );
  $$('.who time').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countTime(el) }));
}

function choreography(voice: { setBase: (w: number) => void }) {
  /* load: the name slams up out of its mask, the rules draw, coordinates settle */
  const intro = gsap.timeline({ defaults: { ease: 'land' } });
  intro.from('.meta-row', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'deploy' }, 0)
    .from('.badge-card', { opacity: 0, y: 24, rotate: 6, duration: 1.1, ease: 'land' }, 0.15)
    .from('.badge-label', { opacity: 0, y: 12, duration: 0.8 }, 0.45)
    .from('.badge-h', { opacity: 0, y: 16, duration: 0.9, ease: 'land' }, 0.5)
    .from('.scope', { clipPath: 'inset(0 0 0 100%)', duration: 1.3, ease: 'deploy' }, 0.2)
    .from('.play', { scale: 0.6, opacity: 0, duration: 1, ease: 'back.out(1.8)' }, 0.55)
    .from('.crop', { scale: 0, duration: 0.8, stagger: 0.05 }, 0.6);
  const scr = $('.scr');
  if (scr) scramble(scr, scr.dataset.final || scr.textContent || '');

  /* the name itself stays still; the small logo in the bar takes over once the hero scrolls away */
  void voice;
  gsap.to('#logo', { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '#top', start: '55% top', end: '85% top', scrub: true } });
  gsap.to('.voice-row', { y: -40, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '#top', start: '40% top', end: 'bottom top', scrub: true } });

  /* headings rise out of masks, kicker rules draw */
  $$('.split-lines').forEach((el) => SplitText.create(el, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'land', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
  }));
  $$('.kicker').forEach((k) => gsap.from(k, { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'deploy', scrollTrigger: { trigger: k, start: 'top 92%', once: true } }));

  /* transcript: every word lights up as you read it; the speaker's bars follow */
  $$('.turn').forEach((turn) => {
    const say = $('.say', turn)!;
    const split = SplitText.create(say, { type: 'words', wordsClass: 'word' });
    const me = turn.classList.contains('me');
    gsap.fromTo(split.words, { opacity: me ? 1 : 0.12, color: me ? '#8A8D86' : '#5E625B' }, {
      opacity: 1, color: me ? '#111311' : '#5E625B', ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: say, start: 'top 82%', end: me ? 'bottom 52%' : 'bottom 62%', scrub: 0.6 },
    });
    ScrollTrigger.create({ trigger: turn, start: 'top 70%', end: 'bottom 45%', toggleClass: 'speaking' });
  });
  gsap.from('.avatar', { scale: 0, rotate: -40, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.12, scrollTrigger: { trigger: '.turns', start: 'top 80%', once: true } });

  /* deployments: each card sinks back as the next one lands on it */
  const cards = $$('.dep');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (next) gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: 0.94, filter: 'brightness(.88)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true } });
    gsap.from($$('.dep-title h3, .dep-title p', card), { yPercent: 50, opacity: 0, duration: 1.1, ease: 'land', stagger: 0.08, scrollTrigger: { trigger: card, start: 'top 75%', once: true } });
    gsap.from($$('.shipped li, .roles li, .visit', card), { y: 18, opacity: 0, duration: 0.8, ease: 'land', stagger: 0.05, scrollTrigger: { trigger: card, start: 'top 60%', once: true } });
    gsap.from($$('.dep-foot .stack span', card), { y: 10, opacity: 0, duration: 0.6, ease: 'land', stagger: 0.04, scrollTrigger: { trigger: card, start: 'top 50%', once: true } });
  });
  $$<HTMLElement>('[data-count]').forEach((el) => {
    const end = +el.dataset.count!, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
    el.textContent = pre + '0' + suf;
    gsap.to(o, { v: end, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => (el.textContent = pre + Math.round(o.v).toLocaleString('en-IN') + suf) });
  });

  /* toolkit: a dark panel opens out to full bleed with an orange rim running just ahead of it */
  gsap.timeline({ scrollTrigger: { trigger: '.toolkit', start: 'top bottom', end: 'top 12%', scrub: 0.6 } })
    .fromTo('.tk-orange', { clipPath: 'inset(7% 4% 0% 4% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 0.8 }, 0)
    .fromTo('.tk-panel', { clipPath: 'inset(12% 8% 0% 8% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 }, 0);
  gsap.from('.tk-head p', { y: 24, opacity: 0, duration: 0.9, ease: 'land', scrollTrigger: { trigger: '.tk-head', start: 'top 80%', once: true } });

  safe('tapes', tapes);
  gsap.from('.cap', { y: 30, opacity: 0, duration: 0.9, ease: 'land', stagger: 0.1, scrollTrigger: { trigger: '.caps', start: 'top 88%', once: true } });
  gsap.from('.cap li', { x: -14, opacity: 0, duration: 0.7, ease: 'land', stagger: 0.04, scrollTrigger: { trigger: '.caps', start: 'top 82%', once: true } });

  /* education: index cards float up at different speeds and settle */
  $$('.icard').forEach((c, i) => gsap.fromTo(c, { y: 120 + i * 50, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#cards', start: 'top bottom', end: 'center 60%', scrub: 0.6 } }));

  /* contact: the postcard swings onto the table, the stamp and postmark land on it */
  const t = innerWidth <= 960 ? [-3, 0] : [-9, -1.5];
  gsap.fromTo('.post-stage', { rotate: t[0], y: 160, opacity: 0.4 }, { rotate: t[1], y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.post-stage', start: 'top bottom', end: 'center 62%', scrub: 0.6 } });
  gsap.from('.pstamp', { scale: 2.2, rotate: 30, opacity: 0, duration: 1, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.post-stage', start: 'clamp(top 65%)', once: true } });
  gsap.from('.postmark', { scale: 1.8, rotate: -40, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.25, scrollTrigger: { trigger: '.post-stage', start: 'clamp(top 65%)', once: true } });
  gsap.from('.send', { scale: 0, rotate: -120, duration: 1.2, ease: 'elastic.out(1,.55)', scrollTrigger: { trigger: '.send-row', start: 'clamp(top 92%)', once: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function boot() {
  safe('common', initCommon);
  let voice = { setBase: (_: number) => {} };
  safe('voice', () => { voice = initVoice(); });
  safe('copy', () => copyButton('#copy', '#addr'));
  safe('form', initForm);
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  safe('workbench', initWorkbench);
  if (reduce) { safe('labels', sectionLabels); return; }
  CustomEase.create('deploy', 'M0,0 C0.7,0 0.2,1 1,1');
  CustomEase.create('land', 'M0,0 C0.16,1 0.3,1 1,1');
  safe('reveals', reveals);
  safe('choreography', () => choreography(voice));
  safe('labels', sectionLabels);
  safe('crosshair', crosshair);
  safe('magnet', () => { magnet('.send', 0.3); magnet('.play', 0.2); });
  safe('tilt', () => { tilt('.icard', 10); });
}

boot();
