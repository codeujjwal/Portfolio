import type { APIRoute } from 'astro';
import { person, deployments, education, projects, toolkit } from '../data/profile';

export const GET: APIRoute = () => {
  const lines = [
    `# ${person.name}`,
    '',
    `> ${person.description}`,
    '',
    `- Role: ${person.role}`,
    `- Location: ${person.location.city}, India (IST, UTC+5:30)`,
    `- Email: ${person.email}`,
    `- LinkedIn: ${person.links.linkedin}`,
    `- GitHub: ${person.links.github}`,
    `- Resume: ${person.site}/resume/`,
    '',
    '## Experience',
    ...deployments.map((d) => `- ${d.company}${d.url ? ` (${d.url})` : ''}, ${d.place}, ${d.when.replace('→', 'to')}: ${d.roles.map((r) => r.title).join(', then earlier ')}. ${d.brief} ${d.items.map((i) => `${i.t}: ${i.d}`).join(' ')}`),
    '',
    '## Skills',
    ...toolkit.caps.map((c) => `- ${c.h}: ${c.items.join(', ')}`),
    '',
    '## Education',
    ...education.map((e) => `- ${e.degree}, ${e.school} (${e.years})`),
    '',
    '## Side projects',
    ...projects.map((p) => (p.url ? `- ${p.name}: ${p.url} (${p.d})` : `- ${p.name}: ${p.d}`)),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
