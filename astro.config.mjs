// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Keep in sync with SITE.url in src/config.ts. Feeds the sitemap and RSS.
  site: "https://frederick-lu-code.github.io",

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    // Slightly warmer than the default; matches the paper background.
    shikiConfig: { theme: "vitesse-light", wrap: true },
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/type-lab"),
    }),
  ],
});
