import { Response } from "express";

// middleware, model & lib imports
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { AuthRequest } from "../libs/AuthRequest.lib";
import Blog from "../models/Blog.model";

// config & utils import
import { SEARCH_MESSAGES } from "../config/messages";
import { successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

export const search = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const query = req.query.query as string;
    nullChecker(res, { query });

    const regex = new RegExp(query, "i");
    const blogs = await Blog.find({
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
