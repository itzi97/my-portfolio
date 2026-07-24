// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
  site: 'https://itziar.dev',
  integrations: [mdx(), sitemap(), icon()],

  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      theme: 'github-dark',
      defaultColor: false,
    },
  },

});
