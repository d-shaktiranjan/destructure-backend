import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const ObjectIdParamSchema = z.object({
    _id: z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid ObjectId",
    }),
});

export type ObjectIdParamType = z.infer<typeof ObjectIdParamSchema>;
