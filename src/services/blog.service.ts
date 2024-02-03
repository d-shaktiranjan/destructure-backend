import { Request, Response } from "express";
import Blog from "../models/Blog.model";
import { BLOG_MESSAGES } from "../config/constants";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

export const getBlogListService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    try {
        // pagination calculations
        const page = parseInt(req.query.page as string) || 1;
        const count = parseInt(req.query.count as string) || 10;
        const skip = (page - 1) * count;

        // meta data calculation
        const totalBlogs = await Blog.countDocuments({ isPublic: true });
        const isNextNull = skip + count >= totalBlogs;

        // blog filter
        let filter = {};
        if (!isAdmin) filter = { isPublic: true };

        // fetch all blog objects from DB
        const allBlogs = await Blog.find(filter, {
            title: 1,
            description: 1,
            slug: 1,
            author: 1,
            content: 1,
            _id: 0,
        })
            .skip(skip)
            .limit(count);

        return successResponse(res, BLOG_MESSAGES.ALL_FETCHED, 200, allBlogs, {
            isNextNull,
        });
    } catch (error) {
        return errorResponse(res, "");
    }
};

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
