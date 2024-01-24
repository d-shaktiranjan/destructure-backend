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

export const createBlog = asyncWrapper(async (req: Request, res: Response) => {
    // get values from request body & null check
    const { title, description, blogSlug, content } = req.body;
    const status = nullChecker(res, { title, description, blogSlug, content });
    if (status !== null) return status;

    // check existing blogObject
    const existingBlog = await Blog.findOne({
        $or: [{ title }, { blogSlug }, { description }],
    });
    if (existingBlog) return errorResponse(res, BLOG_MESSAGES.ALREADY_EXITS);

    // create new blogObject
    const newBlog = new Blog({
        title,
        description,
        blogSlug,
        content,
        author: req.session.user,
    });
    await newBlog.save();

    return successResponse(res, BLOG_MESSAGES.CREATED, 201, newBlog);
});
