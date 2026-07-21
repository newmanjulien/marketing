import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'] })],
  kit: {
    adapter: adapter(),
    alias: {
      $convex: 'convex',
      $shared: 'shared'
    }
  }
};

export default config;
