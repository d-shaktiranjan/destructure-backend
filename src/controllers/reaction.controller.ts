import { Response } from "express";

// model & lib
import { AuthRequest } from "../libs/CustomInterface.lib";
import { BlogDocument, CommentDocument } from "../libs/Documents.lib";
import Blog from "../models/Blog.model";
import Comment from "../models/Comment.model";
import Reaction from "../models/Reaction.model";

// config
import { BLOG_MESSAGES, REACTION_MESSAGES } from "../config/messages";

// middleware, service & utils
import nullChecker from "@/utils/nullChecker.util";
import { formatReactionsUtil } from "@/utils/reaction.util";
import { REACTION_TO } from "../config/constants";
import aw from "../middlewares/asyncWrap.middleware";
import { ReactionType } from "../schemas/reaction.schema";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

export const reaction = aw(async (req: AuthRequest, res: Response) => {
    const { _id, reaction, to } = req.body as ReactionType;

    // new way
    let content: BlogDocument | CommentDocument | null = null;
    if (to === REACTION_TO.BLOG) content = await Blog.findById(_id);
    else content = await Comment.findById(_id);

    if (!content)
        return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, {
            statusCode: 404,
        });

    // check for existing reaction
    const existingReaction = await Reaction.findOne({
        [String(to).toLocaleLowerCase()]: content._id,
        user: req.user?._id,
    });

    // remove reaction object if user request the same reaction
    if (existingReaction && existingReaction.reaction === reaction) {
        await existingReaction.deleteOne();
        return successResponse(res, REACTION_MESSAGES.REMOVED, {
            statusCode: 202,
        });
    }

    const message = existingReaction
        ? REACTION_MESSAGES.UPDATED
        : REACTION_MESSAGES.ADDED;
    const statusCode = existingReaction ? 202 : 201;

    // update reaction
    if (existingReaction) {
        existingReaction.reaction = reaction;
        await existingReaction.save();
        return successResponse(res, message, { statusCode });
    }

    // create new reaction
    new Reaction({
        user: req.user?._id,
        [String(to).toLocaleLowerCase()]: content._id,
        reaction,
    }).save();

    return successResponse(res, message, { statusCode });
});

export const getReactions = aw(async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;
    nullChecker({ slug });

    const userId = req.user?._id;

    // fetch blog _id
    const blog = await Blog.findOne({ slug });
    if (!blog)
        return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, {
            statusCode: 404,
        });

    const reactions = await Reaction.find({
        blog: blog._id,
    });

    const data = formatReactionsUtil(reactions, userId);

    return successResponse(res, REACTION_MESSAGES.LIST, { data });
});
