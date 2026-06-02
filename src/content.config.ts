import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const projects = defineCollection({
	loader: file('./src/content/projects.json'),
	schema: z.object({
		title: z.string(),
		link: z.string().url(),
		summary: z.string(),
		tech: z.string(),
		highlight: z.string(),
		tags: z.array(z.string()),
		origin: z.enum(['U-tad', 'DigiPen', 'Personal']),
		featured: z.boolean().default(false),
	}),
});

export const collections = { blog, projects };
