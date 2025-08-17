import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const blogCreateSchema = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    slug: z.string().trim().toLowerCase(),
    content: z.string().trim(),
    banner: z.url(),
    coAuthor: z
        .string()
        .optional()
        .refine((value) => isValidObjectId(value)),
});

export const blogUpdateSchema = blogCreateSchema.partial().extend({
    _id: z.string().refine((value) => isValidObjectId(value)),
    isPublic: z.boolean().optional(),
});

export type BlogCreateType = z.infer<typeof blogCreateSchema>;
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>;
