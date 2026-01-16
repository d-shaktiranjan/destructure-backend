import { REACTIONS } from "@/config/constants";
import { AuthRequest } from "@/libs/CustomInterface.lib";
import { ReactionDocument } from "@/libs/Documents.lib";

export const getReactionsUtil = (
    req: AuthRequest,
    reactions: ReactionDocument[],
) => {
    const counts = Object.values(REACTIONS).reduce(
        (acc, reaction) => {
            acc[reaction] = 0;
            return acc;
        },
        {} as Record<REACTIONS, number>,
    );

    let givenReaction: ReactionDocument | null = null;

    for (const r of reactions) {
        counts[r.reaction]++;
        if (r.user.toString() === req.user?._id.toString()) {
            givenReaction = r;
        }
    }

    const data = {
        own: {
            isGiven: Boolean(givenReaction),
            reaction: givenReaction?.reaction ?? null,
        },
        reactions: counts,
    };

    return data;
};
