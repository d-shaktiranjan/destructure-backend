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
