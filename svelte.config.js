import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs20.x' }),
    // adapter-vercel prerenders+crawls (unlike the old adapter-static SPA fallback);
    // warn instead of hard-failing on pre-existing broken static links (e.g. favicon.svg).
    prerender: { handleHttpError: 'warn', handleMissingId: 'warn' },
  },
};
