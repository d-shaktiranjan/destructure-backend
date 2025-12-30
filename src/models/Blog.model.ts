import { Schema, model } from "mongoose";
import { BlogDocument } from "../libs/Documents.lib";

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
        banner: { type: String, required: false, default: null },
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
        coAuthor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export default model<BlogDocument>("Blog", blogSchema);
