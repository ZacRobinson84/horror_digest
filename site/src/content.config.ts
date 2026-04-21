import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const digests = defineCollection({
  loader: glob({ pattern: '*.md', base: '../content' }),
  schema: z.object({
    date: z.date(),
    itemCount: z.number(),
    articleCount: z.number(),
    sourceCount: z.number(),
  }),
});

export const collections = { digests };
