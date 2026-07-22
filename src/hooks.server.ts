import { dev } from '$app/environment';
import { readFileSync } from 'node:fs';
import type { Handle } from '@sveltejs/kit';

// In dev, Vite's single-threaded server can stall the font file for seconds
// behind the cold-start compile storm, so the Georgia fallback paints first.
// Inlining the font makes it arrive with the document — Newsreader from first
// paint, same as prod (where the preload + edge cache win the race instead).
// The preload link is dropped along with it: there is nothing left to fetch.
const devFontDataUri = dev
  ? `data:font/woff2;base64,${readFileSync('static/fonts/newsreader.woff2').toString('base64')}`
  : null;

export const handle: Handle = ({ event, resolve }) => {
  if (!devFontDataUri) return resolve(event);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace("url('/fonts/newsreader.woff2')", `url('${devFontDataUri}')`)
        .replace('<link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin />', '')
  });
};
