import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // Cover image shown on the post's card in listings, e.g. ./cover.jpg
      // (relative to the post's folder). Optimised at build time; a wrong
      // path fails the build instead of silently showing a broken image.
      image: image().optional(),
      imageAlt: z.string().optional(),
      date: z.coerce.date(),
      category: z.string().default("General"),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
