import { readdir, unlink } from "fs/promises";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { IMAGE_MESSAGES } from "../config/messages";
import { ALLOWED_IMAGE_MIMETYPE } from "../config/constants";

export const imageList = asyncWrapper(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + "/images/";

    const dirList = (await readdir("public/images"))
        .filter((item) => item != ".gitkeep")
        .map((item) => host + item);

    return successResponse(res, IMAGE_MESSAGES.LIST_FETCHED, 200, dirList);
});

export const imageUpload = asyncWrapper(async (req: Request, res: Response) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length == 0)
        return errorResponse(res, IMAGE_MESSAGES.IMAGE_REQUIRED);

    const urls: string[] = [];
    const host = req.protocol + "://" + req.get("host");
    files.forEach((file) => {
        // allow only images
        if (!ALLOWED_IMAGE_MIMETYPE.includes(file.mimetype)) {
            unlink(file.path);
            return errorResponse(res, IMAGE_MESSAGES.IMAGE_ONLY, 406);
        }

        const url = `${host}/${file.path.replace("public/", "")}`;
        urls.push(url);
    });

    return successResponse(res, IMAGE_MESSAGES.IMAGE_UPLOADED, 201, urls);
});
