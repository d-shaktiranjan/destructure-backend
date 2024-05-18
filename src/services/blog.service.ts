import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Blog from "../models/Blog.model";
import { AuthRequest } from "../libs/AuthRequest.lib";

import { BLOG_MESSAGES, GENERIC_MESSAGES } from "../config/messages";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

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
                from: "users",
                localField: "coAuthor",
                foreignField: "_id",
                as: "coAuthor",
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
                coAuthor: {
                    $cond: {
                        if: { $first: "$coAuthor" },
                        then: { $first: "$coAuthor" },
                        else: null,
                    },
                },
                comments: { $size: "$comments" },
                reactions: { $size: "$reactions" },
                reactionStatus: {
                    $cond: {
                        if: { $in: [req.user?._id, "$reactions.user"] },
                        then: { $first: "$reactions.reaction" },
                        else: null,
                    },
                },
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
    const _id = req.query._id as string;
    nullChecker(res, { _id });

    if (!isValidObjectId(_id))
        return errorResponse(res, GENERIC_MESSAGES.INVALID_ID);

    const searchFilter: { _id: string; isPublic?: boolean } = {
        _id,
        isPublic: true,
    };

    // admin check
    if (isAdmin) delete searchFilter["isPublic"];

    // fetch from DB
    const blog = await Blog.findOne(searchFilter).select("-__v");
    if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

    return successResponse(res, BLOG_MESSAGES.BLOG_FETCHED, 200, blog);
};
