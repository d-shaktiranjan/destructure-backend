import { Response } from "express";
import { isValidObjectId, Types } from "mongoose";

// lib, model & lib
import { AuthRequest } from "../libs/CustomInterface.lib";
import aw from "../middlewares/asyncWrap.middleware";
import Comment from "../models/Comment.model";

// utils & config
import { COMMENT_MESSAGES, GENERIC_MESSAGES } from "../config/messages";
import { getCommentService } from "../services/comment.service";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { getBlogBySlug } from "../utils/blog.util";
import nullChecker from "../utils/nullChecker.util";

export const addComment = aw(async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const slug = req.params.slug as string;
    nullChecker({ content, slug });

    // fetch blog
    const blogObject = await getBlogBySlug(res, slug);

    // create a new object on DB
    const comment = new Comment({
        user: req.user?._id,
        blog: blogObject._id,
        content,
    });
    await comment.save();

    return successResponse(res, COMMENT_MESSAGES.ADDED, { statusCode: 201 });
});

export const removeComment = aw(async (req: AuthRequest, res: Response) => {
    const { _id } = req.query;
    nullChecker({ _id });

    // find the comment on Db
    const comment = await Comment.findById(_id);
    if (!comment) return errorResponse(res, COMMENT_MESSAGES.NOT_FOUND);

    // check ownership
    if (String(comment.user) !== String(req.user?._id))
        return errorResponse(res, GENERIC_MESSAGES.NOT_ALLOWED, {
            statusCode: 401,
        });

    // delete the comment
    await comment.deleteOne();
    return successResponse(res, COMMENT_MESSAGES.DELETED, { statusCode: 202 });
});

export const updateComment = aw(async (req: AuthRequest, res: Response) => {
    const { _id, content } = req.body;
    nullChecker({ _id, content });

    if (!isValidObjectId(_id))
        return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

    // fetch the comment
    const comment = await Comment.findById(_id);
    if (!comment) return errorResponse(res, COMMENT_MESSAGES.NOT_FOUND);

    // check ownership
    if (String(comment.user) !== String(req.user?._id))
        return errorResponse(res, GENERIC_MESSAGES.NOT_ALLOWED, {
            statusCode: 401,
        });

    // update comment
    comment.content = content as string;
    await comment.save();

    return successResponse(res, COMMENT_MESSAGES.UPDATED, { statusCode: 202 });
});

export const getComments = aw(async (req: AuthRequest, res: Response) => {
    const slug = req.params.slug as string;
    nullChecker({ slug });

    const blog = await getBlogBySlug(res, slug);

    const matchQuery: Record<string, unknown> = {
        blog: blog._id,
        parent: undefined,
    };

    return getCommentService(req, res, matchQuery);
});

export const getReplyList = aw(async (req: AuthRequest, res: Response) => {
    const _id = req.query._id as string;
    nullChecker({ _id });
    if (!isValidObjectId(_id))
        return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

    const matchQuery: Record<string, unknown> = {
        parent: new Types.ObjectId(_id),
    };

    return getCommentService(req, res, matchQuery, COMMENT_MESSAGES.REPLY_LIST);
});

export const addReply = aw(async (req: AuthRequest, res: Response) => {
    const { _id, content } = req.body;
    nullChecker({ _id, content });
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
});
