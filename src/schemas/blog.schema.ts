import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const blogCreateSchema = z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    content: z.string(),
    banner: z.string().url(),
    coAuthor: z.string().refine((value) => isValidObjectId(value)),
});
