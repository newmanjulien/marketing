import { text } from '@sveltejs/kit';
import { industries } from '$lib/marketing/industries/industries';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_ORIGIN = 'https://overbase.app';

// Static public pages we want search engines to index.
const staticPaths = ['/', '/about', '/pricing', '/industries'];

export const GET: RequestHandler = () => {
  const paths = [...staticPaths, ...industries.map((industry) => industry.href)];

  const urls = paths
    .map((path) => `  <url>\n    <loc>${SITE_ORIGIN}${path}</loc>\n  </url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return text(body, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
