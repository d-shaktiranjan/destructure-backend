// types
import { Request, Response } from "express";

// middleware
import asyncWrapper from "../middlewares/asyncWrap.middleware";

// util
import { successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

// constant
import { BLOG_MESSAGES } from "../config/constants";

export const createBlog = asyncWrapper(async (req: Request, res: Response) => {
    // get values from request body & null check
    const { title, description, blogSlug, content } = req.body;
    nullChecker(res, { title, description, blogSlug, content });

    // TODO- check existing blogObject

    // TODO- create new blogObject

    // TODO- send response
    return successResponse(res, BLOG_MESSAGES.CREATED, 201);
});
