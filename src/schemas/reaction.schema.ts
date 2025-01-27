import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { REACTIONS } from "../config/constants";

export const reactionSchema = z.object({
    _id: z.string().refine((value) => isValidObjectId(value)),
    to: z.enum(["COMMENT", "BLOG"], { message: "Invalid value" }),
    reaction: z
        .enum(Object.values(REACTIONS) as [string, ...string[]], {
            message: "Invalid value",
        })
        .optional(),
});
