import { defineCollection, z } from "astro:content";
import { glob, type ParseDataOptions } from "astro/loaders";

// Helper function to generate title from filename
const generateTitleFromFilename = (path?: string) =>
  path?.split("/").pop()?.replace(".md", "");

// Helper function to extract image path from markdown link syntax
const extractImagePath = (
  markdownLink: string | undefined,
): string | undefined => {
  if (!markdownLink) return undefined;
  const match = markdownLink.match(/\[.*?]\((.*?)\)/);
  return match?.[1];
};

// Custom glob loader that adds title from filename if missing
function globWithTitleFallback(options: Parameters<typeof glob>[0]) {
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
        return parseData(entry);
      },
      ...rest,
    });

  return loader;
}

const games = defineCollection({
  loader: globWithTitleFallback({
    pattern: "**/*.md",
    base: "./src/content/Games",
  }),
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    related: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: globWithTitleFallback({
    pattern: "**/*.md",
    base: "./src/content/Projects",
  }),
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    summary: z.string().optional(),
    url: z.string().url().optional(),
    image: z.string().optional(),
  }),
});

const content = defineCollection({
  loader: globWithTitleFallback({
    pattern: "**/*.md",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    published: z.date(),
    image: z
      .string()
      .transform((val) => extractImagePath(val) || val)
      .optional(),
  }),
});

export const collections = {
  games,
  projects,
  content,
};
