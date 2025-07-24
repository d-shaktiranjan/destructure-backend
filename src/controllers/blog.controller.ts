import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

// middleware
import aw from "../middlewares/asyncWrap.middleware";

// constant
import {
    BLOG_MESSAGES,
    GENERIC_MESSAGES,
    USER_MESSAGES,
} from "../config/messages";

// model & lib imports
import { AuthRequest } from "../libs/AuthRequest.lib";
import Blog from "../models/Blog.model";
import User from "../models/User.model";

import {
    getBlogDetailsService,
    getBlogListService,
} from "../services/blog.service";

// util
import { BlogDocument } from "../libs/Documents.lib";
import { BlogCreateType, BlogUpdateType } from "../schemas/blog.schema";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { generateSlugUntil, isSlugUniqueUtil } from "../utils/blog.util";
import nullChecker from "../utils/nullChecker.util";

export const createBlog = aw(async (req: AuthRequest, res: Response) => {
    // get values from request body & null check
    const { title, description, slug, content, banner, coAuthor } =
        req.body as BlogCreateType;

    // fetch coAuthor
    if (coAuthor) {
        if (!isValidObjectId(coAuthor))
            return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

        const coAuthorObj = await User.findById(coAuthor);
        if (!coAuthorObj) return errorResponse(res, USER_MESSAGES.NOT_FOUND);

        if (coAuthorObj._id === req.user?._id)
            return errorResponse(res, BLOG_MESSAGES.AUTHORSHIP);
    }

    // check existing blogObject
    const existingBlog = await Blog.findOne({
        $or: [{ title }, { slug }, { description }],
    });
    if (existingBlog) return errorResponse(res, BLOG_MESSAGES.ALREADY_EXITS);

    // create new blogObject
    const newBlog = new Blog({
        title,
        description,
        slug,
        content,
        coAuthor,
        banner,
        author: req?.user?._id,
    });
    await newBlog.save();

    return successResponse(res, BLOG_MESSAGES.CREATED, {
        statusCode: 201,
        data: newBlog,
    });
});

export const getBlogList = aw(async (req: Request, res: Response) =>
    getBlogListService(req, res, false),
);

export const getBlogListAdmin = aw(async (req: Request, res: Response) =>
    getBlogListService(req, res, true),
);

export const getBlogDetails = aw(async (req: AuthRequest, res: Response) => {
    if (req.user?.isAdmin) return getBlogDetailsService(req, res, true);
    return getBlogDetailsService(req, res, false);
});

export const updateBlog = aw(async (req: Request, res: Response) => {
    const body = req.body as BlogUpdateType;
    const { _id } = body;

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
        "banner",
    ];

    // update fields
    for (const key in body) {
        if (!allowedKeys.includes(key))
            return errorResponse(res, key + BLOG_MESSAGES.KEY_NOT_ALLOWED);
        if (key === "_id") continue;

        const value = body[key as keyof BlogUpdateType];
        if (!value) continue;
        // title unique checking
        else if (key === "title") {
            const existingBlog = await Blog.findOne({ title: value });
            if (existingBlog && existingBlog._id !== blog._id)
                return errorResponse(res, BLOG_MESSAGES.UNIQUE_TITLE);
        }

        // handle coAuthor
        else if (key === "coAuthor") {
            if (!isValidObjectId(value))
                return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);
            const coAuthor = await User.findById(value);
            if (!coAuthor) return errorResponse(res, USER_MESSAGES.NOT_FOUND);

            if (!coAuthor.isAdmin)
                return errorResponse(res, BLOG_MESSAGES.CO_AUTHOR_ADD_FAILED);

            if (coAuthor._id === blog.author)
                return errorResponse(res, BLOG_MESSAGES.AUTHORSHIP);
        }

        // update fields
        blog[key as keyof BlogDocument] = value as never;
    }
    await blog.save();

    return successResponse(res, BLOG_MESSAGES.UPDATED, {
        statusCode: 202,
        data: blog,
    });
});

export const checkUniqueSlug = aw(async (req: Request, res: Response) => {
    const slug = req.query.slug as string;
    nullChecker({ slug });

    if (await isSlugUniqueUtil(slug))
        return successResponse(res, BLOG_MESSAGES.SLUG_UNIQUE, {
            data: {
                isUnique: true,
            },
        });

    return errorResponse(res, BLOG_MESSAGES.SLUG_NOT_UNIQUE, {
        statusCode: 409,
    });
});

export const generateSlug = aw(async (req: Request, res: Response) => {
    const title = req.query.title as string;
    nullChecker({ title });

    return successResponse(res, BLOG_MESSAGES.SLUG_GENERATED, {
        data: {
            slug: await generateSlugUntil(title),
        },
    });
});
