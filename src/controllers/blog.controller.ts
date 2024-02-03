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
import { AuthRequest } from "../lib/AuthRequest";
import { getBlogDetailsService } from "../services/blog.service";

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

export const getBlogList = asyncWrapper(async (req: Request, res: Response) => {
    // pagination calculations
    const page = parseInt(req.query.page as string) || 1;
    const count = parseInt(req.query.count as string) || 10;
    const skip = (page - 1) * count;

    // meta data calculation
    const totalBlogs = await Blog.countDocuments({ isPublic: true });
    const isNextNull = skip + count >= totalBlogs;

    // fetch all blog objects from DB
    const allBlogs = await Blog.find(
        { isPublic: true },
        { title: 1, description: 1, slug: 1, author: 1, content: 1, _id: 0 },
    )
        .skip(skip)
        .limit(count);

    return successResponse(res, BLOG_MESSAGES.ALL_FETCHED, 200, allBlogs, {
        isNextNull,
    });
});

export const getBlogDetails = asyncWrapper(
    async (req: Request, res: Response) => {
        return getBlogDetailsService(req, res, false);
    },
);

export const getBlogDetailsAdmin = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        return getBlogDetailsService(req, res, true);
    },
);
