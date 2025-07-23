import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { REACTION_TO, REACTIONS } from "../config/constants";

export const reactionSchema = z.object({
    _id: z.string().refine((value) => isValidObjectId(value)),
    to: z.enum(REACTION_TO, {
        message: `Invalid value, possible values:- ${Object.values(REACTION_TO).join(", ")}`,
    }),
    reaction: z
        .enum(REACTIONS, {
            message: `Invalid value, possible values:- ${Object.values(REACTIONS).join(", ")}`,
        })
        .optional()
        .default(REACTIONS.LIKE),
});

export type ReactionType = z.infer<typeof reactionSchema>;
