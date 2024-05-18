import { Response } from "express";
import { Schema } from "mongoose";

import Blog from "../models/Blog.model";
import { errorResponse } from "./apiResponse.util";
import { BlogDocument } from "../libs/BlogDocument.lib";
import { BLOG_MESSAGES } from "../config/messages";

export const getBlogById = async (
    res: Response,
    _id: Schema.Types.ObjectId,
): Promise<BlogDocument | Response> => {
    const blog = await Blog.findById(_id);
    if (!blog) return errorResponse(res, BLOG_MESSAGES.BLOG_NOT_FOUND);
    return blog;
};

export const isSlugUniqueUtil = async (slug: string): Promise<boolean> => {
    const blog = await Blog.findOne({ slug });
    return blog === null;
};
