import { Schema, Document } from "mongoose";

export interface CommentDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    blog: Schema.Types.ObjectId;
    content: string;
    parent?: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
