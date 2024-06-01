import { Schema, model } from "mongoose";
import { SearchDocument } from "../libs/Documents.lib";

const searchSchema = new Schema<SearchDocument>({
    query: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model<SearchDocument>("Search", searchSchema);
