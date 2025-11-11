// @ts-check
import { defineConfig } from "astro/config";
import matomo from "astro-matomo";
import mdx from "@astrojs/mdx";

import { remarkYouTubeEmbed } from "./src/lib/remark-youtube-embed.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    matomo({
      enabled: import.meta.env.PROD, // Only load in production
      host: "https://matomo.kageetai.net/",
      setCookieDomain: "*.kageetai.net",
      siteId: 1,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkYouTubeEmbed],
  },
});
