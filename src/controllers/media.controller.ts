import { Request, Response } from "express";
import { unlink } from "fs/promises";

// lib, middlewares & models
import { MediaDocument } from "@/libs/Documents.lib";
import aw from "@/middlewares/asyncWrap.middleware";
import Media from "@/models/Media.model";

// config & schemas
import { ALLOWED_MEDIA_MIMETYPE, MEDIA_TYPE } from "@/config/constants";
import { MEDIA_MESSAGES } from "@/config/messages";
import { MediaQueryType } from "@/schemas/media.schema";

// utils
import { errorResponse, successResponse } from "@/utils/apiResponse.util";
import { generateBase64 } from "@/utils/blog.util";
import { calculateFileHash, compressImage } from "@/utils/media.util";

export const mediaList = aw(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host");

    const query = req.query as unknown as MediaQueryType;
    const filter: Record<string, unknown> = {};
    if (query.type && query.type !== "ALL") {
        filter["type"] = query.type;
    }

    const records = await Media.find(filter).sort({ createdAt: -1 });

    const mediaUrls = records.map((record) => {
        let url = host + record.filePath.replace("public/", "/");
        if (record.blurDataURL) {
            url += `?width=${record.width}&height=${record.height}&wiBlurDataURL=${record.blurDataURL}`;
        }
        return url;
    });

    return successResponse(res, MEDIA_MESSAGES.LIST_FETCHED, {
        data: mediaUrls,
    });
});

export const mediaUpload = aw(async (req: Request, res: Response) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length == 0)
        return errorResponse(res, MEDIA_MESSAGES.NO_FILES);

    const urls: string[] = [];
    const host = req.protocol + "://" + req.get("host");

    const mediaRecords: MediaDocument[] = [];

    for (const file of files) {
        // allow only images
        if (!ALLOWED_MEDIA_MIMETYPE.includes(file.mimetype)) {
            unlink(file.path);
            return errorResponse(res, MEDIA_MESSAGES.INVALID_FILE_FORMAT, {
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
        const mediaType = file.mimetype.startsWith("image/")
            ? MEDIA_TYPE.IMAGE
            : MEDIA_TYPE.VIDEO;
        const mediaRecord: MediaDocument = new Media({
            filePath: mediaOutputPath,
            fileHash,
            type: mediaType,
            mimetype: file.mimetype,
        });

        const url = `${host}/${mediaOutputPath.replace("public/", "")}`;

        // compress image
        if (file.mimetype.startsWith("image/")) {
            const fileExtension = file.originalname.split(".").pop();
            mediaOutputPath = file.path.replace(`.${fileExtension}`, `.webp`);
            const { width, height } = await compressImage(
                file.path,
                mediaOutputPath,
            );

            // remove original uploaded image
            unlink(file.path);

            const base = await generateBase64(mediaOutputPath);
            urls.push(
                `${url}?width=${width}&height=${height}&blurDataURL=${base}`,
            );

            mediaRecord.blurDataURL = base;
            mediaRecord.width = width;
            mediaRecord.height = height;
        } else urls.push(url);

        mediaRecords.push(mediaRecord);
    }

    await Media.insertMany(mediaRecords);

    return successResponse(res, MEDIA_MESSAGES.MEDIA_UPLOADED, {
        data: urls,
        statusCode: 201,
    });
});
