import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const blogCreateSchema = z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    content: z.string(),
    banner: z.string().url(),
    // coAuthor: z
    //     .string()
    //     .optional()
    //     .refine((value) => isValidObjectId(value)),
});

export const blogUpdateSchema = blogCreateSchema.partial().extend({
    _id: z.string().refine((value) => isValidObjectId(value)),
    isPublic: z.boolean().optional(),
});
