import { z } from "zod";

export const adminAddSchema = z.object({
    email: z.string().email(),
});
