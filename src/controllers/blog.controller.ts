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
