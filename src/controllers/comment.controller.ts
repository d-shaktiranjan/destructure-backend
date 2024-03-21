import { Response } from "express";

// lib, model & lib
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import Comment from "../models/Comment.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { BlogDocument } from "../libs/BlogDocument.lib";

// utils & config
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";
import { getBlogById } from "../utils/blog.util";
import { COMMENT_MESSAGES, GENERIC_MESSAGE } from "../config/constants";

export const addComment = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { blog, content } = req.body;
        nullChecker(res, { blog, content });

        // fetch blog
        const blogObject = (await getBlogById(res, blog)) as BlogDocument;

        // create a new object on DB
        const comment = new Comment({
            user: req.user?._id,
            blog: blogObject._id,
            content,
        });
        await comment.save();

        return successResponse(res, COMMENT_MESSAGES.ADDED, 201);
    },
);

export const removeComment = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { _id } = req.query;
        nullChecker(res, { _id });

        // find the comment on Db
        const comment = await Comment.findById(_id);
        if (!comment) return errorResponse(res, COMMENT_MESSAGES.NOT_FOUND);

        // check ownership
        if (comment.user !== req.user?._id)
            return errorResponse(res, GENERIC_MESSAGE.NOT_ALLOWED, 401);

        // delete the comment
        await comment.deleteOne();
        return successResponse(res, COMMENT_MESSAGES.DELETED, 202);
    },
);
