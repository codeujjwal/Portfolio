import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://codeujjwal.in',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    // Pre-bundle the animation libraries when the dev server starts. Without this,
    // Vite discovers them on the first page load, re-bundles, and the page can end up
    // requesting stale copies (504 "Outdated Optimize Dep") so no animation runs.
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'gsap/CustomEase', 'lenis', 'matter-js'],
    },
  },
});
