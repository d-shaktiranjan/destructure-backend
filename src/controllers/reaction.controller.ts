import { Response } from "express";
import { isValidObjectId } from "mongoose";

// model & lib
import Blog from "../models/Blog.model";
import Reaction from "../models/Reaction.model";
import Comment from "../models/Comment.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { BlogDocument, CommentDocument } from "../libs/Documents.lib";

// config
import { REACTIONS } from "../config/constants";
import {
    GENERIC_MESSAGES,
    REACTION_MESSAGES,
    BLOG_MESSAGES,
} from "../config/messages";

// middleware, service & utils
import aw from "../middlewares/asyncWrap.middleware";
import nullChecker from "../utils/nullChecker.util";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

export const reaction = aw(async (req: AuthRequest, res: Response) => {
    const { _id, reaction, to } = req.body;
    nullChecker({ _id, to });

    // validate to
    if (!["COMMENT", "BLOG"].includes(to)) return errorResponse(res, "");

    if (!isValidObjectId(_id))
        return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

    // validate reaction
    if (reaction && !Object.values(REACTIONS).includes(reaction))
        return errorResponse(res, REACTION_MESSAGES.INVALID);

    // new way
    let content: BlogDocument | CommentDocument | null = null;
    if (to === "BLOG") content = await Blog.findById(_id);
    else content = await Comment.findById(_id);

    if (!content) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, 404);

    // check for existing reaction
    const existingReaction = await Reaction.findOne({
        [String(to).toLocaleLowerCase()]: content._id,
        user: req.user?._id,
    });

    // remove reaction object if user request the same reaction
    if (existingReaction && existingReaction.reaction === reaction) {
        await existingReaction.deleteOne();
        return successResponse(res, REACTION_MESSAGES.REMOVED, 202);
    }

    const message = existingReaction
        ? REACTION_MESSAGES.UPDATED
        : REACTION_MESSAGES.ADDED;
    const statusCode = existingReaction ? 202 : 201;

    // update reaction
    if (existingReaction) {
        existingReaction.reaction = reaction;
        await existingReaction.save();
        return successResponse(res, message, statusCode);
    }

    // create new reaction
    new Reaction({
        user: req.user?._id,
        [String(to).toLocaleLowerCase()]: content._id,
        reaction,
    }).save();

    return successResponse(res, message, statusCode);
});
