import { Request, Response } from "express";
import { unlink } from "fs/promises";

import { MediaDocument } from "@/libs/Documents.lib";
import Media from "@/models/Media.model";
import { compressImage } from "@/utils/image.util";
import { calculateFileHash } from "@/utils/media.util";
import { ALLOWED_MEDIA_MIMETYPE, MEDIA_TYPE } from "../config/constants";
import { IMAGE_MESSAGES } from "../config/messages";
import aw from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { generateBase64 } from "../utils/blog.util";

export const mediaList = aw(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host");

    const records = await Media.find().sort({ createdAt: -1 });

    const mediaUrls = records.map((record) => {
        let url = host + record.filePath.replace("public/", "/");
        if (record.blurDataURL) {
            url += `?blurDataURL=${record.blurDataURL}`;
        }
        return url;
    });

    return successResponse(res, IMAGE_MESSAGES.LIST_FETCHED, {
        data: mediaUrls,
    });
});

export const mediaUpload = aw(async (req: Request, res: Response) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length == 0)
        return errorResponse(res, IMAGE_MESSAGES.IMAGE_REQUIRED);

    const urls: string[] = [];
    const host = req.protocol + "://" + req.get("host");

    const mediaRecords: MediaDocument[] = [];

    for (const file of files) {
        // allow only images
        if (!ALLOWED_MEDIA_MIMETYPE.includes(file.mimetype)) {
            unlink(file.path);
            return errorResponse(res, IMAGE_MESSAGES.IMAGE_ONLY, {
                statusCode: 406,
            });
        }

        // check for duplicates
        const fileHash = calculateFileHash(file.path);
        const existingMedia = await Media.findOne({ fileHash });
        if (existingMedia) {
            unlink(file.path);
            continue;
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

        const mediaType = file.mimetype.startsWith("image/")
            ? MEDIA_TYPE.IMAGE
            : MEDIA_TYPE.VIDEO;

        // generate url & media record
        const url = `${host}/${mediaOutputPath.replace("public/", "")}`;
        const mediaRecord: MediaDocument = new Media({
            filePath: mediaOutputPath,
            fileHash,
            type: mediaType,
            mimetype: file.mimetype,
        });

        // include base64 for images
        if (file.mimetype.startsWith("image/")) {
            const base = await generateBase64(mediaOutputPath);
            urls.push(`${url}?blurDataURL=${base}`);
            mediaRecord.blurDataURL = base;
        } else urls.push(url);

        mediaRecords.push(mediaRecord);
    }

    await Media.insertMany(mediaRecords);

    return successResponse(res, IMAGE_MESSAGES.IMAGE_UPLOADED, {
        data: urls,
        statusCode: 201,
    });
});
