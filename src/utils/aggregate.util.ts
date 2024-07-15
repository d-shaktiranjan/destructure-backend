import { AuthRequest } from "../libs/AuthRequest.lib";
import { REACTIONS } from "../config/constants";

export const userAggregateUtil = (localField: string) => {
    return {
        $lookup: {
            from: "users",
            localField,
            foreignField: "_id",
            as: localField,
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        picture: 1,
                    },
                },
            ],
        },
    };
};

export const reactionLookup = (foreignField: "comment" | "blog") => {
    return {
        $lookup: {
            from: "reactions",
            localField: "_id",
            foreignField,
            as: "reactions",
        },
    };
};

export const reactionAddField = (
    req: AuthRequest,
    isIncludeExtra: boolean = false,
) => {
    return {
        // if user authenticated then his reaction on the content
        reactionStatus: {
            $cond: {
                if: { $in: [req.user?._id, "$reactions.user"] },
                then: { $first: "$reactions.reaction" },
                else: null,
            },
        },

        // individual reaction counts
        reactions: {
            $cond: {
                if: isIncludeExtra,
                then: Object.keys(REACTIONS).reduce(
                    (accumulator, reaction) => {
                        const reactionKey = reaction as keyof typeof REACTIONS;
                        accumulator[REACTIONS[reactionKey]] = {
                            $size: {
                                $filter: {
                                    input: "$reactions",
                                    cond: {
                                        $eq: [
                                            "$$this.reaction",
                                            REACTIONS[reactionKey],
                                        ],
                                    },
                                },
                            },
                        };
                        return accumulator;
                    },
                    { TOTAL: { $size: "$reactions" } } as {
                        [key: string]: unknown;
                    },
                ),
                else: { $size: "$reactions" },
            },
        },
    };
};

export const commentLookup = () => {
    return {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments",
        },
    };
};
