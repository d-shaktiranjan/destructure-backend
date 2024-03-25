import { BlogDocument } from "../libs/BlogDocument.lib";
import { Schema, model } from "mongoose";

const blogSchema = new Schema<BlogDocument>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            minLength: 3,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export default model<BlogDocument>("Blog", blogSchema);
