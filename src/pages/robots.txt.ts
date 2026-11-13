// robots.txt : indexation autorisée seulement si PUBLIC_SITE_INDEXABLE=true (production validée).
import type { APIRoute } from 'astro';
import { PUBLIC_SITE_INDEXABLE } from 'astro:env/client';

export const GET: APIRoute = ({ site }) => {
  const lines = PUBLIC_SITE_INDEXABLE
    ? ['User-agent: *', 'Allow: /', 'Disallow: /admin/', '', `Sitemap: ${new URL('sitemap-index.xml', site).href}`]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
