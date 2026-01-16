import { REACTIONS } from "@/config/constants";
import { AuthRequest } from "@/libs/CustomInterface.lib";
import { ReactionDocument } from "@/libs/Documents.lib";

export const getReactionsUtil = (
    req: AuthRequest,
    reactions: ReactionDocument[],
) => {
    const count = Object.values(REACTIONS).reduce(
        (acc, reaction) => {
            acc[reaction] = 0;
            return acc;
        },
        {} as Record<REACTIONS, number>,
    );

    let givenReaction: ReactionDocument | null = null;

    for (const r of reactions) {
        count[r.reaction]++;
        if (r.user.toString() === req.user?._id.toString()) {
            givenReaction = r;
        }
    }

    const data = {
        givenStatus: givenReaction?.reaction ?? null,
        count,
    };

    return data;
};
