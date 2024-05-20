import { Response } from "express";

// config
import { COMMENT_MESSAGES } from "../config/messages";

// model & lib imports
import Comment from "../models/Comment.model";
import { successResponse } from "../utils/apiResponse.util";
import { userAggregateUtil } from "../utils/aggregate.util";

export const getCommentService = async (
    res: Response,
    matchQuery: Record<string, unknown>,
    responseMessage: string = COMMENT_MESSAGES.LIST_FETCHED,
) => {
    const allComments = await Comment.aggregate([
        { $match: matchQuery },
        userAggregateUtil("user"),
        {
            $addFields: {
                user: { $first: "$user" },
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

    const statusCode = allComments.length === 0 ? 204 : 200;
    return successResponse(res, responseMessage, statusCode, allComments);
};
