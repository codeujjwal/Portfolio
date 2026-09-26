/**
 * The hero voice memo.
 * The waveform only moves while the intro is playing. The rest of the time it is
 * a flat, silent line. The intro button plays public/audio/intro.mp3 through an
 * analyser when it exists, otherwise a simulated voice speaks the script with
 * live captions. The name never moves (see NAME_MOTION).
 */
import { $, $$, clamp, rand, reduce } from './common';

/** The name never moves. Set to a value above 0 (up to 1) to let it follow the voice while the intro plays. */
const NAME_MOTION = 0;

type Ev = { t0: number; d: number; p: number };
class Engine {
  ev: Ev[] = [];
  level(t: number) {
    let L = 0;
    this.ev = this.ev.filter((e) => t < e.t0 + e.d + 60);
    for (const e of this.ev) {
      const x = (t - e.t0) / e.d;
      if (x < 0 || x > 1) continue;
      const env = x < 0.18 ? x / 0.18 : Math.pow(1 - (x - 0.18) / 0.82, 1.5);
      L = Math.max(L, e.p * env);
    }
    return L;
  }
  clear() { this.ev = []; }
}
const syl = (w: string) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) || []).length);
function speak(engine: Engine, words: string[], start: number, pace = 1) {
  let t = start;
  const times: number[] = [];
  for (const w of words) {
    times.push(t);
    const n = /\d/.test(w) ? Math.max(2, w.length) : syl(w);
    for (let i = 0; i < n; i++) {
      const d = rand(115, 185) * pace;
      engine.ev.push({ t0: t, d, p: rand(0.5, 1) });
      t += d * 0.82;
    }
    t += rand(25, 60) * pace;
    if (/[.?!]$/.test(w)) t += 360 * pace;
    else if (/[,:;]$/.test(w)) t += 170 * pace;
  }
  return { times, end: t };
}
function parseVTT(src: string) {
  const cues: { start: number; end: number; text: string }[] = [];
  const toSec = (s: string) => { const p = s.trim().split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
  for (const block of src.replace(/\r/g, '').split(/\n\n+/)) {
    const lines = block.split('\n');
    const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) continue;
    const [a, b] = lines[i].split('-->');
    const text = lines.slice(i + 1).join(' ').trim();
    if (text) cues.push({ start: toSec(a), end: toSec(b.trim().split(/\s+/)[0]), text });
  }
  return cues;
}

export function initVoice() {
  const name = $('#name'), hero = $('#top'), caption = $('#caption'), play = $<HTMLButtonElement>('#play'), playLabel = $('#playLabel');
  const wave = $<HTMLCanvasElement>('#wave');
  if (!name || !hero || !caption || !play || !playLabel || !wave) return { setBase: (_: number) => {} };

  const letters = $$('.l', name);
  const lines = $$('.ln', name);
  const last = letters.map(() => '');
  const seeds = letters.map(() => rand(0, 1000));
  const engine = new Engine();
  let baseW = 125, amp = 0, active = true, lastBase = -1;

  /* fit the name to the measure of its own column (it now sits beside the photo), at its widest, heaviest setting */
  function fit() {
    name!.style.fontSize = '';
    letters.forEach((l) => (l.style.fontVariationSettings = '"wdth" 125, "wght" 900'));
    const box = name!.parentElement || hero!;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const widest = Math.max(...lines.map((l) => l.getBoundingClientRect().width));
    const fs = parseFloat(getComputedStyle(name!).fontSize);
    // fill the measure, but never taller than about a third of the screen
    const cap = Math.max(140, innerHeight * 0.26);
    name!.style.fontSize = Math.min((fs * avail * 0.995) / widest, cap) + 'px';
    last.fill('');
  }

  function renderLetters(t: number) {
    for (let i = 0; i < letters.length; i++) {
      const trav = Math.sin(t * 0.0062 - i * 0.62);
      const jitter = Math.sin(t * 0.011 + seeds[i]) * 0.5 + Math.sin(t * 0.0037 + seeds[i] * 2) * 0.5;
      // The name stays still unless the intro is playing, and even then it only breathes.
      const a = playing ? amp * NAME_MOTION : 0;
      const v = clamp(a * (0.55 + 0.45 * trav) * 1.5 + jitter * a * 0.4, 0, 1);
      const w = Math.round(clamp(baseW - v * 46, 62, 125) * 2) / 2;
      const g = Math.round(clamp(900 - v * 380, 480, 900) / 10) * 10;
      const s = `"wdth" ${w}, "wght" ${g}`;
      if (s !== last[i]) { letters[i].style.fontVariationSettings = s; last[i] = s; }
    }
  }

  /* voice-memo waveform */
  const ctx = wave.getContext('2d')!;
  const SILENT = 0.03;
  let samples: number[] = [], acc = 0, W = 0, H = 0;
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111311';
  function size() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = wave!.clientWidth; H = wave!.clientHeight;
    wave!.width = W * dpr; wave!.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.ceil(W / 5) + 2;
    if (samples.length < n) samples = new Array(n - samples.length).fill(SILENT).concat(samples);
    samples = samples.slice(-n);
    draw();
  }
  /** Back to a flat, silent line. */
  function flatten() { samples = samples.map(() => SILENT); amp = 0; acc = 0; draw(); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const n = samples.length, mid = H / 2;
    ctx.fillStyle = ink;
    for (let i = 0; i < n; i++) {
      const x = W - (n - 1 - i) * 5 - 4;
      if (x < -3) continue;
      const h = Math.max(1.5, samples[i] * (H * 0.84));
      ctx.globalAlpha = 0.14 + 0.86 * (i / n);
      ctx.fillRect(x, mid - h / 2, 2, h);
    }
    ctx.globalAlpha = 1;
  }

  /* captions */
  const tagline = caption.textContent!.trim();
  let queue: { el: HTMLElement; t: number }[] = [];
  function setCaption(text: string, times: number[]) {
    if (!reduce) caption!.classList.add('live');
    caption!.textContent = '';
    queue = text.split(/\s+/).map((w, i) => {
      const s = document.createElement('span');
      s.className = 'wd'; s.textContent = w;
      caption!.append(s, ' ');
      return { el: s, t: times[i] ?? 0 };
    });
  }
  const restoreCaption = () => { caption!.classList.remove('live'); caption!.textContent = tagline; queue = []; };
  /** Reveal a caption word by word. Only a playing intro feeds the waveform. */
  function sayCaption(text: string, start: number, pace = 1, voiced = true) {
    const { times, end } = speak(voiced ? engine : new Engine(), text.split(/\s+/), start, pace);
    setCaption(text, times);
    return end;
  }

  /* the intro */
  const script: string[] = JSON.parse(play.dataset.lines || '[]');
  let playing = false, timers: number[] = [], pStart = 0, pEnd = 0;
  let audio: HTMLAudioElement | null = null, analyser: AnalyserNode | null = null, actx: AudioContext | null = null, buf: Uint8Array<ArrayBuffer> | null = null;
  let cues: { start: number; end: number; text: string }[] = [], cueIdx = -1, hasAudio: boolean | null = null;

  async function audioAvailable() {
    if (hasAudio !== null) return hasAudio;
    try {
      const r = await fetch(play!.dataset.audio!, { method: 'HEAD', cache: 'no-store' });
      hasAudio = r.ok && (r.headers.get('content-type') || '').startsWith('audio');
    } catch { hasAudio = false; }
    return hasAudio;
  }
  async function loadCues(duration: number) {
    try {
      const r = await fetch(play!.dataset.cues!, { cache: 'no-store' });
      if (r.ok) { const txt = await r.text(); if (txt.trimStart().startsWith('WEBVTT')) { const c = parseVTT(txt); if (c.length) return c; } }
    } catch { /* fall through */ }
    const words = script.map((l) => l.split(/\s+/).length);
    const total = words.reduce((a, b) => a + b, 0);
    let t = 0;
    return script.map((text, i) => { const d = (words[i] / total) * duration; const c = { start: t, end: t + d, text }; t += d; return c; });
  }
  function setUI(on: boolean) {
    play!.classList.toggle('on', on);
    play!.setAttribute('aria-pressed', String(on));
    playLabel!.textContent = on ? 'Stop' : 'Play the 20-second intro';
    if (!on) play!.style.setProperty('--p', '0');
  }
  function stop() {
    playing = false;
    timers.forEach(clearTimeout); timers = [];
    engine.clear();
    if (audio) { audio.pause(); audio.currentTime = 0; }
    cueIdx = -1;
    setUI(false);
    restoreCaption();
    flatten();
  }
  async function start() {
    playing = true; setUI(true); engine.clear();
    if (await audioAvailable()) {
      if (!audio) {
        audio = new Audio(play!.dataset.audio!);
        audio.preload = 'auto';
        actx = new AudioContext();
        const srcNode = actx.createMediaElementSource(audio);
        analyser = actx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.5;
        buf = new Uint8Array(new ArrayBuffer(analyser.fftSize));
        srcNode.connect(analyser); analyser.connect(actx.destination);
        audio.addEventListener('ended', () => stop());
      }
      await actx!.resume();
      if (!audio.duration || isNaN(audio.duration)) await new Promise((r) => audio!.addEventListener('loadedmetadata', r, { once: true }));
      cues = await loadCues(audio.duration);
      if (!playing) return;
      cueIdx = -1;
      try { await audio.play(); } catch { stop(); }
      return;
    }
    // simulated voice
    let t = performance.now() + 250;
    pStart = t;
    for (const line of script) {
      const dry = speak(new Engine(), line.split(/\s+/), 0, 1.05);
      const at = t;
      timers.push(window.setTimeout(() => { if (playing) sayCaption(line, performance.now(), 1.05); }, at - performance.now()));
      t += dry.end + 650;
    }
    pEnd = t;
    timers.push(window.setTimeout(() => stop(), t - performance.now() + 400));
  }
  play.addEventListener('click', () => (playing ? stop() : start()));

  /* main loop: the waveform only runs while the intro plays */
  let prev = performance.now();
  function loop(t: number) {
    const dt = Math.min(64, t - prev); prev = t;
    if (active && playing) {
      let target = SILENT;
      if (audio && analyser && buf && !audio.paused) {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        target = clamp(Math.sqrt(sum / buf.length) * 5, 0, 1);
        const ct = audio.currentTime;
        const idx = cues.findIndex((c) => ct >= c.start && ct < c.end);
        if (idx !== -1 && idx !== cueIdx) {
          cueIdx = idx;
          const c = cues[idx], words = c.text.split(/\s+/), span = (c.end - c.start) * 1000 * 0.85, now = performance.now();
          setCaption(c.text, words.map((_, i) => now + (span * i) / words.length));
        }
        play!.style.setProperty('--p', String(audio.duration ? ct / audio.duration : 0));
      } else if (!audio) {
        // simulated voice (no recording on this build)
        target = Math.min(1, engine.level(t) + SILENT);
        play!.style.setProperty('--p', String(clamp((t - pStart) / (pEnd - pStart), 0, 1)));
      }
      amp += (target - amp) * (target > amp ? 0.45 : 0.12);
      acc += dt;
      while (acc > 42) { samples.push(clamp(amp + rand(-0.025, 0.025), 0.02, 1)); samples.shift(); acc -= 42; }
      draw();
    }
    if (active) for (const q of queue) if (!q.el.classList.contains('on') && t >= q.t) q.el.classList.add('on');
    if (NAME_MOTION > 0 && (active || baseW !== lastBase)) { renderLetters(t); lastBase = baseW; }
    requestAnimationFrame(loop);
  }

  /* boot */
  fit(); size();
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { fit(); size(); }, 120); });
  document.fonts?.ready.then(() => fit());

  if (reduce) {
    flatten();
    // still allow the intro: captions change, nothing moves
    return { setBase: (_: number) => {} };
  }

  new IntersectionObserver(([e]) => { active = e.isIntersecting; }).observe(hero);
  // the tagline types itself in on load, silently: the waveform stays flat
  sayCaption(tagline, performance.now() + 700, 0.8, false);
  requestAnimationFrame(loop);

  return {
    setBase(w: number) { baseW = w; },
  };
}
