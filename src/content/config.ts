import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/Games' }),
  schema: z.object({
    title: z.string().optional(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    related: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/Projects' }),
  schema: z.object({
    title: z.string().optional(),
    created: z.string(),
    changed: z.string(),
    publish: z.boolean(),
    summary: z.string().optional(),
    url: z.string().url().optional(),
    image: z.string().optional(),
  }),
});

const content = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content' }),
  schema: z.object({
    title: z.string().optional(),
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
