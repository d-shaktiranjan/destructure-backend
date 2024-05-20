import { Response } from "express";
import { isValidObjectId, Types } from "mongoose";

// lib, model & lib
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import Comment from "../models/Comment.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { BlogDocument } from "../libs/BlogDocument.lib";

// utils & config
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";
import { getBlogById } from "../utils/blog.util";
import { COMMENT_MESSAGES, GENERIC_MESSAGES } from "../config/messages";
import { getCommentService } from "../services/comment.service";

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
        if (String(comment.user) !== String(req.user?._id))
            return errorResponse(res, GENERIC_MESSAGES.NOT_ALLOWED, 401);

        // delete the comment
        await comment.deleteOne();
        return successResponse(res, COMMENT_MESSAGES.DELETED, 202);
    },
);

export const updateComment = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { _id, content } = req.body;
        nullChecker(res, { _id, content });

        if (!isValidObjectId(_id))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        // fetch the comment
        const comment = await Comment.findById(_id);
        if (!comment) return errorResponse(res, COMMENT_MESSAGES.NOT_FOUND);

        // check ownership
        if (String(comment.user) !== String(req.user?._id))
            return errorResponse(res, GENERIC_MESSAGES.NOT_ALLOWED, 401);

        // update comment
        comment.content = content as string;
        comment.isEdited = true;
        await comment.save();

        return successResponse(res, COMMENT_MESSAGES.UPDATED, 202);
    },
);

export const getComments = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const blog = req.query.blog as string;
        nullChecker(res, { blog });
        if (!isValidObjectId(blog))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        const matchQuery: Record<string, unknown> = {
            blog: new Types.ObjectId(blog),
            parent: undefined,
        };

        return getCommentService(req, res, matchQuery);
    },
);

export const getReplyList = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const _id = req.query._id as string;
        nullChecker(res, { _id });
        if (!isValidObjectId(_id))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        const matchQuery: Record<string, unknown> = {
            parent: new Types.ObjectId(_id),
        };

        return getCommentService(
            req,
            res,
            matchQuery,
            COMMENT_MESSAGES.REPLY_LIST,
        );
    },
);

export const addReply = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { _id, content } = req.body;
        nullChecker(res, { _id, content });
        if (!isValidObjectId(_id))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        // fetch comment
        const comment = await Comment.findById(_id);
        if (!comment) return errorResponse(res, COMMENT_MESSAGES.NOT_FOUND);

        // create new reply
        const reply = new Comment({
            user: req.user?._id,
            blog: comment.blog,
            parent: comment._id,
            content,
        });
        await reply.save();

        return successResponse(res, COMMENT_MESSAGES.REPLY_ADDED);
    },
);
