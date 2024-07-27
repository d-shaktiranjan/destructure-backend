import { Schema, model } from "mongoose";
import { LoggerDocument } from "../libs/Documents.lib";

const loggerSchema = new Schema<LoggerDocument>({
    method: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    },
    headers: {
        type: Object,
        required: true,
    },
    query: {
        type: Object,
        required: true,
    },
    body: {
        type: Object,
        required: true,
    },
    response: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export default model<LoggerDocument>("Logger", loggerSchema);
