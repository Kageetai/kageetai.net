// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { remarkYouTubeEmbed } from "./src/lib/remark-youtube-embed.ts";
import { anchorLinkIcon } from "./src/lib/anchor-link-icon.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],

  markdown: {
    remarkPlugins: [remarkYouTubeEmbed],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "anchor-link",
            ariaLabel: "Link to this section",
          },
          content: anchorLinkIcon,
        },
      ],
    ],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
