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
