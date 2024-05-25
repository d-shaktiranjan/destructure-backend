import { AuthRequest } from "../libs/AuthRequest.lib";

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
                        email: 0,
                        isAdmin: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
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

export const reactionAddField = (req: AuthRequest) => {
    return {
        reactions: { $size: "$reactions" },
        reactionStatus: {
            $cond: {
                if: { $in: [req.user?._id, "$reactions.user"] },
                then: { $first: "$reactions.reaction" },
                else: null,
            },
        },
    };
};
