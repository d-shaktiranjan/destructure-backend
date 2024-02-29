import { Schema, Document } from "mongoose";

export interface ReactionDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    blog: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}
