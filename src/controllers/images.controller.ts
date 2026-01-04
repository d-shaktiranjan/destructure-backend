import { Request, Response } from "express";
import { fileTypeFromFile } from "file-type";
import { readdir, unlink } from "fs/promises";

import { compressImage } from "@/utils/image.util";
import { ALLOWED_MEDIA_MIMETYPE, MEDIA_UPLOAD_PATH } from "../config/constants";
import { IMAGE_MESSAGES } from "../config/messages";
import aw from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { generateBase64 } from "../utils/blog.util";

export const imageList = aw(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + "/media/";

    const files = (await readdir(MEDIA_UPLOAD_PATH)).filter(
        (item) => item !== ".gitkeep",
    );

    const dirList = await Promise.all(
        files.map(async (item) => {
            const file = await fileTypeFromFile(MEDIA_UPLOAD_PATH + "/" + item);

            if (file && file.mime.startsWith("image/")) {
                const blurDataURL = await generateBase64(
                    MEDIA_UPLOAD_PATH + "/" + item,
                );
                return `${host}${item}?blurDataURL=${blurDataURL}`;
            }
            return `${host}${item}`;
        }),
    );

    return successResponse(res, IMAGE_MESSAGES.LIST_FETCHED, { data: dirList });
});

export const imageUpload = aw(async (req: Request, res: Response) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length == 0)
        return errorResponse(res, IMAGE_MESSAGES.IMAGE_REQUIRED);

    const urls: string[] = [];
    const host = req.protocol + "://" + req.get("host");

    for (const file of files) {
        // allow only images
        if (!ALLOWED_MEDIA_MIMETYPE.includes(file.mimetype)) {
            unlink(file.path);
            return errorResponse(res, IMAGE_MESSAGES.IMAGE_ONLY, {
                statusCode: 406,
            });
        }

        let mediaOutputPath = file.path;

        // compress image
        if (file.mimetype.startsWith("image/")) {
            const fileExtension = file.originalname.split(".").pop();
            mediaOutputPath = file.path.replace(`.${fileExtension}`, `.webp`);
            await compressImage(file.path, mediaOutputPath);

            // remove original uploaded image
            unlink(file.path);
        }

        // generate url
        const url = `${host}/${mediaOutputPath.replace("public/", "")}`;

        // include base64 for images
        if (file.mimetype.startsWith("image/")) {
            const base = await generateBase64(mediaOutputPath);
            urls.push(`${url}?blurDataURL=${base}`);
        } else urls.push(url);
    }

    return successResponse(res, IMAGE_MESSAGES.IMAGE_UPLOADED, {
        data: urls,
        statusCode: 201,
    });
});
