import { defineCollection, z } from 'astro:content';
import { glob, type ParseDataOptions } from 'astro/loaders';

// Helper function to generate title from filename
const generateTitleFromFilename = (entry: string): string => {
  const fileName = entry.split('/').pop()?.replace(/\.mdx?$/, '') || '';
  const cleanedFileName = fileName.replace(/-+/g, ' ').replace(/^-+|-+$/g, '');
  return cleanedFileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Custom glob loader that adds title from filename if missing
function globWithTitleFallback(options: Parameters<typeof glob>[0]) {
  const loader = glob(options);
  const originalLoad = loader.load;

  loader.load = async ({ parseData, ...rest }) =>
    originalLoad({
      parseData: async <TData extends Record<string, unknown>>(entry: ParseDataOptions<TData>) => {
        // Add title from filename if not present
        const data = entry.data as Record<string, unknown>;
        if (!data.title && entry.id) {
          data.title = generateTitleFromFilename(entry.id);
        }
        return parseData(entry);
      },
      ...rest
    });

  return loader;
}

const games = defineCollection({
  loader: globWithTitleFallback({
    pattern: '**/*.md',
    base: './content/Games',
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
    pattern: '**/*.md',
    base: './content/Projects',
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
    pattern: '**/*.md',
    base: './content',
  }),
  schema: z.object({
    title: z.string(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
  }),
});

export const collections = {
  games,
  projects,
  content,
};
