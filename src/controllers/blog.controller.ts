// types
import { Request, Response } from "express";

// middleware
import asyncWrapper from "../middlewares/asyncWrap.middleware";

// util
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

// constant
import { BLOG_MESSAGES } from "../config/constants";

// model
import Blog from "../models/Blog.model";
import { AuthRequest } from "../libs/AuthRequest.lib";
import {
    getBlogDetailsService,
    getBlogListService,
} from "../services/blog.service";

export const createBlog = asyncWrapper(async (req: Request, res: Response) => {
    // get values from request body & null check
    const { title, description, slug, content } = req.body;
    const status = nullChecker(res, { title, description, slug, content });
    if (status !== null) return status;

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
        author: null, //TODO
    });
    await newBlog.save();

    return successResponse(res, BLOG_MESSAGES.CREATED, 201, newBlog);
});

export const getBlogList = asyncWrapper(async (req: Request, res: Response) =>
    getBlogListService(req, res, false),
);

export const getBlogListAdmin = asyncWrapper(
    async (req: Request, res: Response) => getBlogListService(req, res, true),
);

export const getBlogDetails = asyncWrapper(
    async (req: Request, res: Response) =>
        getBlogDetailsService(req, res, false),
);

export const getBlogDetailsAdmin = asyncWrapper(
    async (req: AuthRequest, res: Response) =>
        getBlogDetailsService(req, res, true),
);

export const updateBlog = asyncWrapper(async (req: Request, res: Response) => {
    const { slug } = req.body;

    // fetch blog in DB
    const blog = await Blog.findOne({ slug });
    if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

    // validate request body data
    const allowedKeys = ["title", "description", "content", "isPublic", "slug"];
    for (const keyName in req.body) {
        if (!allowedKeys.includes(keyName))
            return errorResponse(res, keyName + " is not allowed to update");
    }

    // update fields
    for (const keyName of allowedKeys) {
        const value = req.body[keyName];
        if (value == null) continue;

        // isPublic type check
        if (keyName == "isPublic" && typeof value != "boolean")
            return errorResponse(res, "");

        // title
        if (keyName == "title") {
            const existingBlog = await Blog.findOne({ title: value });
            if (existingBlog && existingBlog._id !== blog._id)
                return errorResponse(res, "Chose new title");
        }

        // update fields
        // blog[keyName] = value; TODO
    }
    await blog.save();

    return successResponse(res, "Updated", 202, blog);
});
