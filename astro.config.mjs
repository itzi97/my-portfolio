// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
  site: 'https://itziar.dev',

  redirects: {
    '/blog': '/notes',
    '/blog/[...slug]': '/notes/[...slug]',
  },

  integrations: [mdx(), sitemap(), icon()],

  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
      defaultColor: false,
    },
  },

});
