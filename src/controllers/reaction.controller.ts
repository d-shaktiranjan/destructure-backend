import { Response } from "express";

// model & middleware imports
import asyncWrapper from "@/middlewares/asyncWrap.middleware";
import { AuthRequest } from "@/libs/AuthRequest.lib";
import Blog from "@/models/Blog.model";
import Reaction from "@/models/Reaction.model";

// util imports
import nullChecker from "@/utils/nullChecker.util";
import { getReactionCountOfBlog } from "@/utils/reaction.util";
import { errorResponse, successResponse } from "@/utils/apiResponse.util";

// config imports
import { BLOG_MESSAGES, REACTION_MESSAGES } from "@/config/constants";

export const toggleReaction = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { slug } = req.body;
        nullChecker(res, { slug });

        // fetch blog
        const blog = await Blog.findOne({ slug });
        if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, 404);

        // check for existing reaction
        const reaction = await Reaction.findOne({
            blog: blog._id,
            user: req.user?._id,
        });

        // remove reaction
        if (reaction) {
            await reaction.deleteOne();
            return successResponse(res, REACTION_MESSAGES.REMOVED, 200, {
                reaction: getReactionCountOfBlog(blog._id),
            });
        }

        // add reaction
        const newReaction = new Reaction({
            user: req.user?._id,
            blog: blog._id,
        });
        await newReaction.save();

        return successResponse(res, REACTION_MESSAGES.ADDED, 201, {
            reaction: getReactionCountOfBlog(blog._id),
        });
    },
);
