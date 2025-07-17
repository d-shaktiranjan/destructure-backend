import { Request, Response } from "express";

import { AuthRequest } from "../libs/AuthRequest.lib";
import Blog from "../models/Blog.model";

import { BLOG_MESSAGES } from "../config/messages";
import {
    commentLookup,
    reactionAddField,
    reactionLookup,
    userAggregateUtil,
} from "../utils/aggregate.util";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

export const getBlogListService = async (
    req: AuthRequest,
    res: Response,
    isAdmin: boolean,
) => {
    // sort variables
    let sort = req.query.sort;
    switch (sort) {
        case "oldest":
            sort = "createdAt";
            break;
        case "mostLiked":
            sort = "-reactions";
            break;
        default:
            sort = "-createdAt";
            break;
    }

    // blog filter
    let filter = {};
    if (!isAdmin) filter = { isPublic: true };

    // fetch blog from DB
    const allBlogs = await Blog.aggregate([
        { $match: filter },
        userAggregateUtil("author"),
        userAggregateUtil("coAuthor"),
        commentLookup(),
        reactionLookup("blog"),
        {
            $project: {
                __v: 0,
                content: 0,
            },
        },
        {
            $addFields: {
                author: { $first: "$author" },
                coAuthor: {
                    $cond: {
                        if: { $first: "$coAuthor" },
                        then: { $first: "$coAuthor" },
                        else: null,
                    },
                },
                comments: { $size: "$comments" },
                ...reactionAddField(req),
            },
        },
    ]).sort(sort);

    return successResponse(res, BLOG_MESSAGES.ALL_FETCHED, { data: allBlogs });
};

export const getBlogDetailsService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    // collect slug from query
    const slug = req.query.slug as string;
    nullChecker({ slug });

    const searchFilter: { slug: string; isPublic?: boolean } = {
        slug,
        isPublic: true,
    };

    // admin check
    if (isAdmin) delete searchFilter["isPublic"];

    // fetch from DB
    const blog = await Blog.aggregate([
        { $match: searchFilter },
        userAggregateUtil("author"),
        userAggregateUtil("coAuthor"),
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blog",
                as: "comments",
            },
        },
        reactionLookup("blog"),
        {
            $project: {
                __v: 0,
            },
        },
        {
            $addFields: {
                author: { $first: "$author" },
                coAuthor: {
                    $cond: {
                        if: { $first: "$coAuthor" },
                        then: { $first: "$coAuthor" },
                        else: null,
                    },
                },
                comments: { $size: "$comments" },
                ...reactionAddField(req),
            },
        },
    ]);
    if (blog.length === 0)
        return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, {
            statusCode: 404,
        });

    return successResponse(res, BLOG_MESSAGES.BLOG_FETCHED, { data: blog[0] });
};
