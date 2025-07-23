import { z } from "zod";

export const adminAddSchema = z.object({
    email: z.email(),
});

export type AdminAddSchema = z.infer<typeof adminAddSchema>;
