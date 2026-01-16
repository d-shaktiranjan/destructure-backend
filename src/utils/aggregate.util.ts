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
