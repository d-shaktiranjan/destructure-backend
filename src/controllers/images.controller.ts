import { readdir, unlink } from "fs/promises";
import { Request, Response } from "express";

import aw from "../middlewares/asyncWrap.middleware";
import {
    errorResponse,
    noContentResponse,
    successResponse,
} from "../utils/apiResponse.util";
import { IMAGE_MESSAGES } from "../config/messages";
import { ALLOWED_IMAGE_MIMETYPE } from "../config/constants";
import { generateBase64 } from "../utils/blog.util";

export const imageList = aw(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + "/images/";

    const dirList = (await readdir("public/images"))
        .filter((item) => item != ".gitkeep")
        .map((item) => host + item);
    if (dirList.length === 0) return noContentResponse(res);

    return successResponse(res, IMAGE_MESSAGES.LIST_FETCHED, 200, dirList);
});

export const imageUpload = aw(async (req: Request, res: Response) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length == 0)
        return errorResponse(res, IMAGE_MESSAGES.IMAGE_REQUIRED);

    const urls: { url: string; base: string }[] = [];
    const host = req.protocol + "://" + req.get("host");

    for (const file of files) {
        // allow only images
        if (!ALLOWED_IMAGE_MIMETYPE.includes(file.mimetype)) {
            unlink(file.path);
            return errorResponse(res, IMAGE_MESSAGES.IMAGE_ONLY, 406);
        }

        // generate url & base64
        const url = `${host}/${file.path.replace("public/", "")}`;
        const base = await generateBase64(file.path);
        urls.push({ url, base });
    }

    return successResponse(res, IMAGE_MESSAGES.IMAGE_UPLOADED, 201, urls);
});
