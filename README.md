# codeujjwal.in

Portfolio of Ujjwal Sharma, forward deployed engineer. Built with [Astro](https://astro.build), [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering), deployed on Netlify.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build
```

Needs Node 22.12 or newer.

## Change the content

Everything the site says is in **`src/data/profile.ts`**: roles, projects, education, the transcript, the intro script, links. The home page, the resume page, the structured data for search engines, `llms.txt` and the sitemap all read from it, so one edit updates all of them.

- **New job or role**: add an entry at the top of `deployments`. Numbering and stacking are automatic.
- **New side project**: add it to `projects`.
- **Photo**: `public/images/ujjwal-avatar-160.webp` (transcript avatar) and `public/images/ujjwal-sharma.jpg` (search engines).
- **University logos**: put `walsh`, `woolf` and `aktu` logo files (`.svg`, `.png` or `.webp`) in `public/images/edu/`. Each card picks its logo up at build time and shows a monogram seal until then.
- **Workbench objects**: the story behind each card is in `desk`; the card artwork is in `src/components/Workbench.astro`.

## The 20-second intro

The play button in the hero uses your real voice when it finds one.

1. Record yourself reading the lines in `intro.lines` in `src/data/profile.ts` (about 20 seconds).
2. Save it as `public/audio/intro.mp3`.
3. Optional: add `public/audio/intro.vtt` for exact caption timing:

   ```
   WEBVTT

   00:00.000 --> 00:01.600
   Hi, I'm Ujjwal.

   00:01.800 --> 00:07.400
   I'm a forward deployed engineer. I sit with the people who run a business and ship the software they need.
   ```

Without a VTT, the lines are spread across the recording by word count. Without an mp3, the intro plays silently with a simulated voice.

## Contact form (Netlify Forms)

The postcard is a plain HTML form with `data-netlify="true"`, so Netlify picks it up at deploy time. One-time setup in the Netlify dashboard:

1. **Site configuration → Forms → Enable form detection**, then redeploy.
2. **Forms → Form notifications → Add notification → Email** and send it to hello@codeujjwal.in.

Submissions appear under **Forms → contact**. Spam is filtered by Netlify plus a honeypot field. Without JavaScript the form still posts and lands on `/thanks/`.

## Share image and resume PDF

`public/og.png` and `public/ujjwal-sharma-resume.pdf` are generated files. After changing content, rebuild them with Playwright:

```bash
pip install playwright && playwright install chromium
npm run build && python3 tools/render.py all && npm run build
```

## Motion and accessibility

- Every section is readable with JavaScript off. Animations start from content that is already on the page.
- With "reduce motion" turned on, smooth scrolling, scrubbed effects and the talking name switch off.
- The native cursor always stays. On mouse and trackpad a small label shows what a click will do.
