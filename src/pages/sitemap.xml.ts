import type { APIRoute } from 'astro';

const pages = [
  { path: '/', priority: '1.0' },
  { path: '/resume/', priority: '0.8' },
];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://codeujjwal.in');
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${new URL(p.path, base).href}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
