import { readFileSync } from "fs";
import { Response } from "express";
import { Schema } from "mongoose";
import { getPlaiceholder } from "plaiceholder";

import Blog from "../models/Blog.model";
import { BlogDocument } from "../libs/Documents.lib";
import { BLOG_MESSAGES } from "../config/messages";
import ApiError from "../libs/ApiError.lib";

export const getBlogById = async (
    res: Response,
    _id: Schema.Types.ObjectId,
): Promise<BlogDocument> => {
    const blog = await Blog.findById(_id);
    if (!blog) throw new ApiError(BLOG_MESSAGES.BLOG_NOT_FOUND);
    return blog;
};

export const isSlugUniqueUtil = async (slug: string): Promise<boolean> => {
    const blog = await Blog.findOne({ slug });
    return blog === null;
};

export const generateSlugUntil = async (title: string): Promise<string> => {
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace special chars with "-"
        .replace(/^-+|-+$/g, ""); // remove 1st & last "-"

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

export const generateBase64 = async (imagePath: string): Promise<string> => {
    const file = readFileSync(imagePath);
    const { base64 } = await getPlaiceholder(file);
    return base64;
};
