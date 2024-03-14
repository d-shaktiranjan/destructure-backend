import { Request, Response } from "express";
import Blog from "../models/Blog.model";
import { BLOG_MESSAGES } from "../config/constants";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

export const getBlogListService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    // pagination calculations
    const page = parseInt(req.query.page as string) || 1;
    const count = parseInt(req.query.count as string) || 10;
    const skip = (page - 1) * count;

    // blog filter
    let filter = {};
    if (!isAdmin) filter = { isPublic: true };

    // meta data calculation
    const totalBlogs = await Blog.countDocuments(filter);
    const isNextNull = skip + count >= totalBlogs;

    const allBlogs = await Blog.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            email: 0,
                            isAdmin: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blog",
                as: "comments",
            },
        },
        {
            $lookup: {
                from: "reactions",
                localField: "_id",
                foreignField: "blog",
                as: "reactions",
            },
        },
        {
            $project: {
                __v: 0,
            },
        },
        {
            $addFields: {
                author: { $first: "$author" },
                comments: { $size: "$comments" },
                reactions: { $size: "$reactions" },
            },
        },
        { $skip: skip },
        { $limit: count },
    ]);

    return successResponse(res, BLOG_MESSAGES.ALL_FETCHED, 200, allBlogs, {
        isNextNull,
    });
};

export const getBlogDetailsService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    try {
        // collect slug from query
        const { slug } = req.params;
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
