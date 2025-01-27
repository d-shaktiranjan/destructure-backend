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
import Blog from "../models/Blog.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { BlogDocument } from "../libs/Documents.lib";
import User from "../models/User.model";

import {
    getBlogDetailsService,
    getBlogListService,
} from "../services/blog.service";

// util
import {
    errorResponse,
    noContentResponse,
    successResponse,
} from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";
import { generateSlugUntil, isSlugUniqueUtil } from "../utils/blog.util";
import {
    commentLookup,
    reactionAddField,
    reactionLookup,
} from "../utils/aggregate.util";

export const createBlog = aw(async (req: AuthRequest, res: Response) => {
    // get values from request body & null check
    const { title, description, slug, content, banner, coAuthor } = req.body;

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

    return successResponse(res, BLOG_MESSAGES.CREATED, 201, newBlog);
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
    const { _id } = req.body;

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
    for (const keyName in req.body) {
        if (!allowedKeys.includes(keyName))
            return errorResponse(res, keyName + BLOG_MESSAGES.KEY_NOT_ALLOWED);
        if (keyName === "_id") continue;

        const key = keyName as keyof BlogDocument;
        const value = req.body[key];

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
        blog[key] = value as never;
    }
    await blog.save();

    return successResponse(res, BLOG_MESSAGES.UPDATED, 202, blog);
});

export const coAuthorList = aw(async (req: AuthRequest, res: Response) => {
    const adminList = await User.find({
        isAdmin: true,
        _id: { $ne: req.user?._id },
    }).select("_id name picture");
    if (adminList.length === 0) return noContentResponse(res);

    return successResponse(res, BLOG_MESSAGES.CO_AUTHOR_LIST, 200, adminList);
});

export const checkUniqueSlug = aw(async (req: Request, res: Response) => {
    const slug = req.query.slug as string;
    nullChecker({ slug });

    if (await isSlugUniqueUtil(slug))
        return successResponse(res, BLOG_MESSAGES.SLUG_UNIQUE, 200, {
            isUnique: true,
        });

    return errorResponse(res, BLOG_MESSAGES.SLUG_NOT_UNIQUE, 409);
});

export const generateSlug = aw(async (req: Request, res: Response) => {
    const title = req.query.title as string;
    nullChecker({ title });

    return successResponse(res, BLOG_MESSAGES.SLUG_GENERATED, 200, {
        slug: await generateSlugUntil(title),
    });
});

export const blogStats = aw(async (req: Request, res: Response) => {
    const slug = req.query.slug as string;
    nullChecker({ slug });

    // fetch blog details
    const blog = await Blog.aggregate([
        { $match: { slug } },
        reactionLookup("blog"),
        commentLookup(),
        {
            $addFields: {
                ...reactionAddField(req, true),
                comments: { $size: "$comments" },
            },
        },
        { $project: { _id: 0, reactions: 1, comments: 1, reactionStatus: 1 } },
    ]);

    if (blog.length === 0)
        return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

    return successResponse(res, BLOG_MESSAGES.STATS_FETCHED, 200, blog[0]);
});

export const slugList = aw(async (req: Request, res: Response) => {
    const slugList = (await Blog.find({ isPublic: true })).map(
        (blog) => blog.slug,
    );
    if (slugList.length === 0) return noContentResponse(res);

    return successResponse(res, BLOG_MESSAGES.SLUG_LIST_FETCHED, 200, slugList);
});
