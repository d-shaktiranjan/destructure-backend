import { REACTIONS } from "../config/constants";
import { ReactionDocument } from "../libs/ReactionDocument.lib";
import { Schema, model } from "mongoose";

const reactionSchema = new Schema<ReactionDocument>({
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reaction: {
        type: String,
        enum: REACTIONS,
        default: REACTIONS.LIKE,
    },
});

export default model<ReactionDocument>("Reaction", reactionSchema);
