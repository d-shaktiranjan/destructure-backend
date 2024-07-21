import { Response } from "express";

// middleware, model & lib imports
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { AuthRequest } from "../libs/AuthRequest.lib";
import Blog from "../models/Blog.model";

// config & utils import
import { BLOG_MESSAGES, SEARCH_MESSAGES } from "../config/messages";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

export const search = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const query = req.query.query as string;
    nullChecker(res, { query });

    const regex = new RegExp(query, "i");
    const blogs = await Blog.find({
        isPublic: true,
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { slug: { $regex: regex } },
        ],
    }).select("_id title description slug");

    if (req.user) req.user.storeSearchResult(query);

    return successResponse(
        res,
        SEARCH_MESSAGES.RESULT_FETCHED,
        blogs.length > 0 ? 200 : 204,
        blogs,
    );
});

export const getSearchHistory = (req: AuthRequest, res: Response) => {
    return successResponse(
        res,
        SEARCH_MESSAGES.HISTORY_FETCHED,
        200,
        req.user?.searches,
    );
};

export const deleteSearchHistory = (req: AuthRequest, res: Response) => {
    const _id = req.query._id as string;
    nullChecker(res, { _id });

    // get the index of the query
    const user = req.user;
    const index = user?.searches.findIndex((item) => String(item._id) === _id);
    if (index === undefined || index < 0)
        return errorResponse(res, SEARCH_MESSAGES.NOT_FOUND);

    // remove the item
    req.user?.searches.splice(index, 1);
    req.user?.save();

    return successResponse(res, SEARCH_MESSAGES.HISTORY_DELETED);
};

export const linkBlogInSearch = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { _id, blog } = req.body;
        nullChecker(res, { _id, blog });

        // get the index of the query
        const user = req.user;
        const index = user?.searches.findIndex(
            (item) => String(item._id) === _id,
        );
        if (index === undefined || index < 0)
            return errorResponse(res, SEARCH_MESSAGES.NOT_FOUND);

        // find the blog
        const blogObject = await Blog.findOne({ slug: blog });
        if (!blogObject)
            return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);

        // update the search object
        user!.searches[index].blog = blogObject._id;
        user?.save();

        return successResponse(res, SEARCH_MESSAGES.LINK_BLOG_IN_QUERY);
    },
);
