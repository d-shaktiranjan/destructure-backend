import { Types } from "mongoose";

import { REACTIONS } from "@/config/constants";
import { ReactionDocument } from "@/libs/Documents.lib";

export const formatReactionsUtil = (
    reactions: ReactionDocument[],
    userId?: Types.ObjectId,
) => {
    const count = Object.values(REACTIONS).reduce(
        (acc, reaction) => {
            acc[reaction] = 0;
            return acc;
        },
        {} as Record<REACTIONS, number>,
    );

    let givenStatus: REACTIONS | null = null;

    for (const r of reactions) {
        count[r.reaction]++;
        if (userId && r.user.toString() === userId.toString()) {
            givenStatus = r.reaction;
        }
    }

    return {
        givenStatus,
        count,
    };
};
