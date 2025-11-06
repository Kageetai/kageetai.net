import { defineCollection, z } from "astro:content";
import { glob, type ParseDataOptions } from "astro/loaders";

// Helper function to generate title from filename
const generateTitleFromFilename = (path?: string) =>
  path?.split("/").pop()?.replace(".md", "");

// Helper function to extract image path from markdown link or wiki-link syntax
const extractImagePath = (
  markdownLink: string | undefined,
): string | undefined => {
  if (!markdownLink) return undefined;

  // Try wiki-link format: [[filename]]
  const wikiMatch = markdownLink.match(/\[\[(.+?)\]\]/);
  if (wikiMatch?.[1]) {
    return `./attachments/${decodeURIComponent(wikiMatch[1])}`;
  }

  // Try markdown link format: [text](path)
  const mdMatch = markdownLink.match(/\[.*?]\((.*?)\)/);
  if (mdMatch?.[1]) {
    // Decode URL-encoded characters (e.g., %20 -> space)
    return decodeURIComponent(mdMatch[1]);
  }

  return undefined;
};

// Custom glob loader that adds title from filename if missing and extracts image paths
function globWithTitleAndImageFallback(options: Parameters<typeof glob>[0]) {
  const loader = glob(options);
  const originalLoad = loader.load;

  loader.load = async ({ parseData, ...rest }) =>
    originalLoad({
      parseData: async <TData extends Record<string, unknown>>(
        entry: ParseDataOptions<TData>,
      ) => {
        // Add title from filename if not present
        const data = entry.data as Record<string, unknown>;
        if (!data.title) {
          data.title = generateTitleFromFilename(entry.filePath);
        }

        // Extract image path from markdown link format if needed
        const frontmatterImage = data.image as string | undefined;
        if (frontmatterImage) {
          const imagePath =
            extractImagePath(frontmatterImage) || frontmatterImage;
          // Convert the path to be relative to the markdown file
          // Astro's image() helper will handle the actual resolution
          data.image = imagePath;
        }

        return parseData(entry);
      },
      ...rest,
    });

  return loader;
}

const games = defineCollection({
  loader: globWithTitleAndImageFallback({
    pattern: "**/*.md",
    base: "./src/content/Games",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      created: z.string(),
      changed: z.string(),
      publish: z.boolean(),
      published: z.date(),
      summary: z.string().optional(),
      related: z.string().optional(),
      image: image().optional(),
    }),
});

const projects = defineCollection({
  loader: globWithTitleAndImageFallback({
    pattern: "**/*.md",
    base: "./src/content/Projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      created: z.string(),
      changed: z.string(),
      publish: z.boolean(),
      published: z.date(),
      summary: z.string().optional(),
      url: z.string().url().optional(),
      image: image().optional(),
    }),
});

const content = defineCollection({
  loader: globWithTitleAndImageFallback({
    pattern: "**/*.md",
    base: "./src/content",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      created: z.string(),
      changed: z.string(),
      publish: z.boolean(),
      published: z.date(),
      image: image().optional(),
      summary: z.string().optional(),
    }),
});

export const collections = {
  games,
  projects,
  content,
};
