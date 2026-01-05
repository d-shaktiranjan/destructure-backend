import { Schema, model } from "mongoose";

import { ALLOWED_MEDIA_MIMETYPE, MEDIA_TYPE } from "@/config/constants";
import { MediaDocument } from "@/libs/Documents.lib";

const mediaSchema = new Schema<MediaDocument>({
    filePath: {
        type: String,
        required: true,
        unique: true,
    },
    fileHash: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: MEDIA_TYPE,
        required: true,
    },
    mimetype: {
        type: String,
        enum: ALLOWED_MEDIA_MIMETYPE,
        required: true,
    },
    blurDataURL: {
        type: String,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model<MediaDocument>("Media", mediaSchema);
