/**
 * HAST node for the anchor link icon (Lucide Link2).
 *
 * Why we can't import @lucide/astro directly:
 * rehype-autolink-headings runs at build time during markdown processing
 * and requires HAST nodes (HTML Abstract Syntax Tree), not Astro components.
 * The @lucide/astro package provides Astro components which can't be used here.
 */
export const anchorLinkIcon = {
  type: "element",
  tagName: "svg",
  properties: {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: {
        d: "M9 17H7A5 5 0 0 1 7 7h2",
      },
      children: [],
    },
    {
      type: "element",
      tagName: "path",
      properties: {
        d: "M15 7h2a5 5 0 1 1 0 10h-2",
      },
      children: [],
    },
    {
      type: "element",
      tagName: "line",
      properties: {
        x1: "8",
        x2: "16",
        y1: "12",
        y2: "12",
      },
      children: [],
    },
  ],
} as const;
