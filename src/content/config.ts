import { defineCollection, z } from "astro:content";
import { glob, type ParseDataOptions } from "astro/loaders";
import type { ImageMetadata } from "astro:assets";

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
    return `./attachments/${wikiMatch[1]}`;
  }

  // Try markdown link format: [text](path)
  const mdMatch = markdownLink.match(/\[.*?]\((.*?)\)/);
  return mdMatch?.[1];
};

// Import all images from content directory
const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/**/attachments/*.{png,jpg,jpeg,webp,gif}",
);

// Helper to resolve image paths
async function resolveImage(
  imagePath: string | undefined,
): Promise<ImageMetadata | undefined> {
  if (!imagePath) return undefined;

  // Handle relative paths like ./attachments/image.webp
  const normalizedPath = imagePath.startsWith("./")
    ? `/src/content/${imagePath.substring(2)}`
    : imagePath;

  // Try to find matching image
  for (const [path, imageImport] of Object.entries(images)) {
    if (
      path.endsWith(decodeURIComponent(normalizedPath.split("/").pop() || ""))
    ) {
      const image = await imageImport();
      return image.default;
    }
  }

  return undefined;
}

// Custom glob loader that adds title from filename if missing and resolves images
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

        // Resolve image from frontmatter before parsing
        const frontmatterImage = data.image as string | undefined;
        if (frontmatterImage) {
          // Extract path from markdown link format if needed
          const imagePath =
            extractImagePath(frontmatterImage) || frontmatterImage;
          const resolvedImage = await resolveImage(imagePath);

          if (resolvedImage) {
            // Replace the string with resolved ImageMetadata before parsing
            data.image = resolvedImage;
          }
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
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    related: z.string().optional(),
    image: z.any().optional(),
  }),
});

const projects = defineCollection({
  loader: globWithTitleAndImageFallback({
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
    image: z.any().optional(),
  }),
});

const content = defineCollection({
  loader: globWithTitleAndImageFallback({
    pattern: "**/*.md",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    published: z.date(),
    image: z.any().optional(),
  }),
});

export const collections = {
  games,
  projects,
  content,
};
