import { Request, Response } from "express";

import Blog from "../models/Blog.model";
import { AuthRequest } from "../libs/AuthRequest.lib";

import { BLOG_MESSAGES } from "../config/messages";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";
import {
    reactionLookup,
    reactionAddField,
    userAggregateUtil,
} from "../utils/aggregate.util";

export const getBlogListService = async (
    req: AuthRequest,
    res: Response,
    isAdmin: boolean,
) => {
    // pagination calculations
    const page = parseInt(req.query.page as string) || 1;
    const count = parseInt(req.query.count as string) || 10;
    const skip = (page - 1) * count;

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

    // meta data calculation
    const totalBlogs = await Blog.countDocuments(filter);
    const isNextNull = skip + count >= totalBlogs;

    const allBlogs = await Blog.aggregate([
        { $match: filter },
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
        { $skip: skip },
        { $limit: count },
    ]).sort(sort);

    return successResponse(res, BLOG_MESSAGES.ALL_FETCHED, 200, allBlogs, {
        isNextNull,
        totalCount: await Blog.countDocuments(filter),
    });
};

export const getBlogDetailsService = async (
    req: Request,
    res: Response,
    isAdmin: boolean,
) => {
    // collect slug from query
    const slug = req.query.slug as string;
    nullChecker(res, { slug });

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
        return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND, 404);

    return successResponse(res, BLOG_MESSAGES.BLOG_FETCHED, 200, blog[0]);
};
