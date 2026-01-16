import { Response } from "express";

// config
import { COMMENT_MESSAGES } from "../config/messages";

// model & lib imports
import { formatReactionsUtil } from "@/utils/reaction.util";
import { AuthRequest } from "../libs/CustomInterface.lib";
import Comment from "../models/Comment.model";
import { reactionLookup, userAggregateUtil } from "../utils/aggregate.util";
import { successResponse } from "../utils/apiResponse.util";

export const getCommentService = async (
    req: AuthRequest,
    res: Response,
    matchQuery: Record<string, unknown>,
    responseMessage: string = COMMENT_MESSAGES.LIST_FETCHED,
) => {
    const comments = await Comment.aggregate([
        { $match: matchQuery },
        userAggregateUtil("user"),
        reactionLookup("comment"),
        {
            $addFields: {
                user: { $first: "$user" },
                isCommentOwner: {
                    $eq: [{ $first: "$user._id" }, req.user?._id],
                },
            },
        },
        {
            $project: {
                blog: 0,
                __v: 0,
                parent: 0,
            },
        },
    ]);

    const data = comments.map((comment) => ({
        ...comment,
        reactions: formatReactionsUtil(comment.reactions, req.user?._id),
    }));

    return successResponse(res, responseMessage, { data });
};
