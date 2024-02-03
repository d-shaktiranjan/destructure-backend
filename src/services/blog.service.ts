import { Request, Response } from "express";
import Blog from "../models/Blog.model";
import { BLOG_MESSAGES } from "../config/constants";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

export const getBlogDetailsService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    try {
        // collect slug from query
        const { slug } = req.query;
        if (!slug || typeof slug != "string")
            return errorResponse(res, BLOG_MESSAGES.SLUG_MISSING);

        const searchFilter: { slug: string; isPublic?: boolean } = {
            slug,
            isPublic: true,
        };

        // admin check
        if (isAdmin) delete searchFilter["isPublic"];

        // fetch from DB
        const blog = await Blog.findOne(searchFilter).select("-_id -__v");
        if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

        return successResponse(res, BLOG_MESSAGES.BLOG_FETCHED, 200, blog);
    } catch (error) {
        return errorResponse(res, "");
    }
};
