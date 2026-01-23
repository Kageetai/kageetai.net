// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import { remarkYouTubeEmbed } from "./src/lib/remark-youtube-embed.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],

  markdown: {
    remarkPlugins: [remarkYouTubeEmbed],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
