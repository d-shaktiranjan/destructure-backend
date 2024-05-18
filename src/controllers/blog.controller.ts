import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { unlink } from "fs/promises";

// middleware
import asyncWrapper from "../middlewares/asyncWrap.middleware";

// util
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";
import { getReactionCountOfBlog } from "../utils/reaction.util";
import { generateSlugUntil, isSlugUniqueUtil } from "../utils/blog.util";

// constant
import { ALLOWED_IMAGE_MIMETYPE, REACTIONS } from "../config/constants";
import {
    BLOG_MESSAGES,
    GENERIC_MESSAGES,
    REACTION_MESSAGES,
    USER_MESSAGES,
} from "../config/messages";

// model & lib imports
import Reaction from "../models/Reaction.model";
import Blog from "../models/Blog.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { ReactionDocument } from "../libs/ReactionDocument.lib";
import { BlogDocument } from "../libs/BlogDocument.lib";
import User from "../models/User.model";

import {
    getBlogDetailsService,
    getBlogListService,
} from "../services/blog.service";

export const createBlog = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        // get values from request body & null check
        const { title, description, slug, content, coAuthor } = req.body;
        const status = nullChecker(res, { title, description, slug, content });
        if (status !== null) return status;

        // fetch coAuthor
        if (coAuthor) {
            if (!isValidObjectId(coAuthor))
                return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

            const coAuthorObj = await User.findById(coAuthor);
            if (!coAuthorObj)
                return errorResponse(res, USER_MESSAGES.NOT_FOUND);

            if (coAuthorObj._id === req.user?._id)
                return errorResponse(res, BLOG_MESSAGES.AUTHORSHIP);
        }

        // check existing blogObject
        const existingBlog = await Blog.findOne({
            $or: [{ title }, { slug }, { description }],
        });
        if (existingBlog)
            return errorResponse(res, BLOG_MESSAGES.ALREADY_EXITS);

        // create new blogObject
        const newBlog = new Blog({
            title,
            description,
            slug,
            content,
            coAuthor,
            author: req?.user?._id,
        });
        await newBlog.save();

        return successResponse(res, BLOG_MESSAGES.CREATED, 201, newBlog);
    },
);

export const getBlogList = asyncWrapper(async (req: Request, res: Response) =>
    getBlogListService(req, res, false),
);

export const getBlogListAdmin = asyncWrapper(
    async (req: Request, res: Response) => getBlogListService(req, res, true),
);

export const getBlogDetails = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        if (req.user?.isAdmin) return getBlogDetailsService(req, res, true);
        return getBlogDetailsService(req, res, false);
    },
);

export const updateBlog = asyncWrapper(async (req: Request, res: Response) => {
    const { _id } = req.body;
    nullChecker(res, { _id });

    if (!isValidObjectId(_id))
        return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

    // fetch blog in DB
    const blog = await Blog.findById(_id);
    if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

    // validate request body data
    const allowedKeys = [
        "_id",
        "title",
        "description",
        "content",
        "isPublic",
        "slug",
        "coAuthor",
    ];

    // update fields
    for (const keyName in req.body) {
        if (!allowedKeys.includes(keyName))
            return errorResponse(res, keyName + BLOG_MESSAGES.KEY_NOT_ALLOWED);
        if (keyName === "_id") continue;

        const key = keyName as keyof BlogDocument;
        const value = req.body[key];
        if (value === null) continue;

        // isPublic type check
        if (key === "isPublic" && typeof value != "boolean")
            return errorResponse(res, BLOG_MESSAGES.IS_PUBLIC_TYPE);

        // title unique checking
        if (key === "title") {
            const existingBlog = await Blog.findOne({ title: value });
            if (existingBlog && existingBlog._id !== blog._id)
                return errorResponse(res, BLOG_MESSAGES.UNIQUE_TITLE);
        }

        // handle coAuthor
        if (key === "coAuthor") {
            if (!isValidObjectId(value))
                return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);
            const coAuthor = await User.findById(value);
            if (!coAuthor) return errorResponse(res, USER_MESSAGES.NOT_FOUND);

            if (!coAuthor.isAdmin)
                return errorResponse(res, BLOG_MESSAGES.CO_AUTHOR_ADD_FAILED);

            if (coAuthor.__v === blog._id)
                return errorResponse(res, BLOG_MESSAGES.AUTHORSHIP);
        }

        // update fields
        blog[key] = value as never;
    }
    await blog.save();

    return successResponse(res, BLOG_MESSAGES.UPDATED, 202, blog);
});

export const reaction = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { _id, reaction } = req.body;
        nullChecker(res, { _id });

        if (!isValidObjectId(_id))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        // validate reaction
        if (reaction && !Object.values(REACTIONS).includes(reaction))
            return errorResponse(res, REACTION_MESSAGES.INVALID);

        // fetch blog
        const blog = await Blog.findById(_id);
        if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, 404);

        // check for existing reaction
        const existingReaction = await Reaction.findOne({
            blog: blog._id,
            user: req.user?._id,
        });

        // remove reaction object if user request the same reaction
        if (existingReaction && existingReaction.reaction === reaction) {
            await existingReaction.deleteOne();
            return successResponse(res, REACTION_MESSAGES.REMOVED, 202, {
                reaction: getReactionCountOfBlog(blog._id),
            });
        }

        // update or create reaction
        const updatedReaction = existingReaction
            ? ({ ...existingReaction, reaction } as ReactionDocument)
            : new Reaction({ user: req.user?._id, blog: blog._id, reaction });
        await updatedReaction.save();

        const message = existingReaction
            ? REACTION_MESSAGES.UPDATED
            : REACTION_MESSAGES.ADDED;
        const statusCode = existingReaction ? 202 : 201;

        return successResponse(res, message, statusCode);
    },
);

export const imageUpload = asyncWrapper(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) return errorResponse(res, BLOG_MESSAGES.IMAGE_REQUIRED);

    // allow only images
    if (!ALLOWED_IMAGE_MIMETYPE.includes(file.mimetype)) {
        unlink(file.path);
        return errorResponse(res, BLOG_MESSAGES.IMAGE_ONLY, 406);
    }

    const host = req.protocol + "://" + req.get("host");
    const url = `${host}/${file.path.replace("public/", "")}`;

    return successResponse(res, BLOG_MESSAGES.IMAGE_UPLOADED, 201, {
        url,
    });
});

export const coAuthorList = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const adminList = await User.find({
            isAdmin: true,
            _id: { $ne: req.user?._id },
        }).select("_id name picture");

        return successResponse(
            res,
            BLOG_MESSAGES.CO_AUTHOR_LIST,
            200,
            adminList,
        );
    },
);

export const checkUniqueSlug = asyncWrapper(
    async (req: Request, res: Response) => {
        const slug = req.query.slug as string;
        nullChecker(res, { slug });

        if (await isSlugUniqueUtil(slug))
            return successResponse(res, BLOG_MESSAGES.SLUG_UNIQUE, 200, {
                isUnique: true,
            });

        return errorResponse(res, BLOG_MESSAGES.SLUG_NOT_UNIQUE, 409);
    },
);

export const generateSlug = asyncWrapper(
    async (req: Request, res: Response) => {
        const title = req.query.title as string;
        return successResponse(res, BLOG_MESSAGES.SLUG_GENERATED, 200, {
            slug: await generateSlugUntil(title),
        });
    },
);
