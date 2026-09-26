/**
 * Contact postcard. The form is a plain Netlify form (data-netlify="true"), so it
 * works without JavaScript by posting to /thanks/. With JavaScript it validates
 * inline, posts in the background and flips the postcard over.
 */
import { gsap } from 'gsap';
import { $, reduce } from './common';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initForm() {
  const form = $<HTMLFormElement>('#contactForm');
  const card = $('#postcard');
  if (!form || !card) return;
  const status = $('#formStatus')!, send = $<HTMLButtonElement>('#send')!, again = $<HTMLButtonElement>('#again')!;
  const fields = {
    name: { el: $<HTMLInputElement>('#f-name')!, err: $('#e-name')!, check: (v: string) => (v.trim().length >= 2 ? '' : 'Tell me your name.') },
    email: { el: $<HTMLInputElement>('#f-email')!, err: $('#e-email')!, check: (v: string) => (EMAIL.test(v.trim()) ? '' : 'That email looks incomplete.') },
    message: { el: $<HTMLTextAreaElement>('#f-msg')!, err: $('#e-msg')!, check: (v: string) => (v.trim().length >= 10 ? '' : 'A sentence or two, please (10+ characters).') },
  };

  const validate = (key: keyof typeof fields) => {
    const f = fields[key];
    const msg = f.check(f.el.value);
    f.err.textContent = msg;
    f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) f.el.setAttribute('aria-describedby', f.err.id); else f.el.removeAttribute('aria-describedby');
    return !msg;
  };
  (Object.keys(fields) as (keyof typeof fields)[]).forEach((k) => {
    fields[k].el.addEventListener('blur', () => fields[k].el.value && validate(k));
    fields[k].el.addEventListener('input', () => fields[k].err.textContent && validate(k));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = (Object.keys(fields) as (keyof typeof fields)[]).map(validate).every(Boolean);
    if (!ok) {
      status.textContent = 'A couple of lines need fixing.';
      status.classList.add('bad');
      const first = (Object.values(fields).find((f) => f.el.getAttribute('aria-invalid') === 'true'))?.el;
      first?.focus();
      if (!reduce) gsap.fromTo('.post-stage', { x: -10 }, { x: 0, duration: 0.7, ease: 'elastic.out(1,.3)' });
      return;
    }
    send.disabled = true;
    status.classList.remove('bad');
    status.textContent = 'Posting…';
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw new Error(String(res.status));
      const first = fields.name.el.value.trim().split(/\s+/)[0];
      $('#sentNote')!.textContent = `Thanks, ${first}. I'll reply to ${fields.email.el.value.trim()} within a day.`;
      status.textContent = 'Sent.';
      card.classList.add('sent');
      again.tabIndex = 0;
      form.querySelectorAll<HTMLElement>('input, textarea, button').forEach((el) => (el.tabIndex = -1));
      if (!reduce) gsap.fromTo('.sent-stamp', { scale: 2.4, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.7, ease: 'back.out(2)', delay: 0.9 });
      else gsap.set('.sent-stamp', { opacity: 1 });
      setTimeout(() => again.focus(), reduce ? 0 : 1100);
    } catch {
      status.classList.add('bad');
      status.textContent = "That didn't go through. Try again, or email hello@codeujjwal.in.";
    } finally {
      send.disabled = false;
    }
  });

  again.addEventListener('click', () => {
    form.reset();
    card.classList.remove('sent');
    status.textContent = '';
    again.tabIndex = -1;
    form.querySelectorAll<HTMLElement>('input, textarea, button').forEach((el) => el.removeAttribute('tabindex'));
    form.querySelector<HTMLInputElement>('input[name="bot-field"]')!.tabIndex = -1;
    gsap.set('.sent-stamp', { opacity: 0 });
    setTimeout(() => fields.name.el.focus(), reduce ? 0 : 900);
  });
}
