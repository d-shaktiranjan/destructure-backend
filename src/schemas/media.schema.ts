import { z } from "zod";

import { MEDIA_TYPE } from "@/config/constants";

export const MediaQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    type: z.enum([...Object.values(MEDIA_TYPE), "ALL"]).default("ALL"),
});
export type MediaQueryType = z.infer<typeof MediaQuerySchema>;
