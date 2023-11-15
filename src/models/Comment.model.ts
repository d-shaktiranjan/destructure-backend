import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        blogSlug: {
            type: String,
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
        givenBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default model("Comment", commentSchema);
