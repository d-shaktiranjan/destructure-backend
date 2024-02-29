import { ReactionDocument } from "@/libs/ReactionDocument.lib";
import { Schema, model } from "mongoose";

const likeSchema = new Schema<ReactionDocument>({
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export default model<ReactionDocument>("Like", likeSchema);
