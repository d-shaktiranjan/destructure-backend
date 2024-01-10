import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            minLength: 3,
            required: true,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
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
