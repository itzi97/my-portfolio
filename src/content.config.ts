import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		// 'post' = long-form write-up, 'note' = short TIL/thought
		kind: z.enum(['post', 'note']).default('post'),
	}),
});

const log = defineCollection({
	loader: file('./src/content/log.json'),
	schema: z.object({
		date: z.coerce.date(),
		type: z.enum(['book', 'game']),
		title: z.string(),
		status: z.enum(['playing', 'reading', 'finished', 'dropped', 'replaying']),
		note: z.string().default(''),
		link: z.string().url().optional(),
	}),
});

const projects = defineCollection({
	loader: file('./src/content/projects.json'),
	schema: z.object({
		title: z.string(),
		link: z.string().optional().nullable(),
		summary: z.string(),
		tech: z.string(),
		highlight: z.string(),
		tags: z.array(z.string()),
		origin: z.enum(['U-tad', 'DigiPen', 'Personal']),
		featured: z.boolean().default(false),
		blogSlug: z.string().optional(),
		githubUrl: z.string().url().optional(),
		externalUrl: z.string().url().optional(),
		externalLabel: z.string().optional(),
	}),
});

export const collections = { blog, projects, log };
