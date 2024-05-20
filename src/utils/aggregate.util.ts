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
