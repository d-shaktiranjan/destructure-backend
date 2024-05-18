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

export const generateSlugUntil = async (title: string): Promise<string> => {
    let slug = title.replaceAll(" ", "-");
    if (await isSlugUniqueUtil(slug)) return slug;

    let count = 2;
    while (count > -1) {
        const newSlug = `${slug}-${count}`;
        if (await isSlugUniqueUtil(newSlug)) {
            slug = newSlug;
            count = -1;
            continue;
        }
        count++;
    }
    return slug;
};
