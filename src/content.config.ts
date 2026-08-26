import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const covers = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/covers" }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    /** The bit after v= in the YouTube URL. */
    youtubeId: z.string(),
    date: z.coerce.date(),
    /** Why this song. One or two sentences, in your voice. */
    note: z.string(),
    /** Pins the cover to the top of /music. Only the newest featured one wins. */
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences under the title. */
    deck: z.string(),
    date: z.coerce.date(),
    /** Where the project lives. The card links here. */
    href: z.url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const musings = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/musings" }),
  schema: z.object({
    title: z.string(),
    /** Shown under the title and used as the meta description. */
    deck: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { covers, musings, projects };
