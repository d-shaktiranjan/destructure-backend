import { Schema, model } from "mongoose";
import { CommentDocument } from "../libs/Documents.lib";

const commentSchema = new Schema<CommentDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },
        content: {
            type: String,
            minLength: 3,
            required: true,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    },
    { timestamps: true },
);

export default model<CommentDocument>("Comment", commentSchema);
