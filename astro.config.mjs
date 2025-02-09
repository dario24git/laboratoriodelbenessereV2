import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import alpinejs from "@astrojs/alpinejs";
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  resolve: {
    // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
    // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
    // TODO: wait for this PR: https://github.com/withastro/adapters/pull/436#issuecomment-2525190557
    alias:
      process.env.NODE_ENV === 'production'
        ? {
            'react-dom/server': 'react-dom/server.edge',
          }
        : undefined,
  },

  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables"
    }
  },

  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },

  site: 'https://lexingtonthemes.com',
  integrations: [sitemap(), mdx(), react(), alpinejs()],
  adapter: cloudflare()
});