import { z } from "zod";

export const blogCreateSchema = z.object({
    title: z.string().trim(),
    description: z.string().trim().optional(),
    slug: z.string().trim().toLowerCase(),
    content: z.string().trim(),
    banner: z.url().optional(),
    coAuthor: z.string().optional(),
});

export const blogUpdateSchema = blogCreateSchema
    .omit({ slug: true })
    .partial()
    .extend({
        isPublic: z.boolean().optional(),
    });

export type BlogCreateType = z.infer<typeof blogCreateSchema>;
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>;
