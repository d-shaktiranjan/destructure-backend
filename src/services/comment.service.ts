import { Response } from "express";

// config
import { COMMENT_MESSAGES } from "../config/messages";

// model & lib imports
import { AuthRequest } from "../libs/AuthRequest.lib";
import Comment from "../models/Comment.model";
import {
    reactionAddField,
    reactionLookup,
    userAggregateUtil,
} from "../utils/aggregate.util";
import { successResponse } from "../utils/apiResponse.util";

export const getCommentService = async (
    req: AuthRequest,
    res: Response,
    matchQuery: Record<string, unknown>,
    responseMessage: string = COMMENT_MESSAGES.LIST_FETCHED,
) => {
    const allComments = await Comment.aggregate([
        { $match: matchQuery },
        userAggregateUtil("user"),
        reactionLookup("comment"),
        {
            $addFields: {
                user: { $first: "$user" },
                isCommentOwner: {
                    $eq: [{ $first: "$user._id" }, req.user?._id],
                },
                ...reactionAddField(req),
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

    return successResponse(res, responseMessage, { data: allComments });
};
