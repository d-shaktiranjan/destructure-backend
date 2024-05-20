import { REACTIONS } from "../config/constants";
import { Schema, Document } from "mongoose";

export interface ReactionDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    blog?: Schema.Types.ObjectId;
    comment?: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    reaction: REACTIONS;
}
