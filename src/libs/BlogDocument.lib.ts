import { Document, Schema } from "mongoose";

export interface BlogDocument extends Document {
    title: string;
    description: string;
    slug: string;
    content: string;
    author: Schema.Types.ObjectId;
    coAuthor: Schema.Types.ObjectId;
    isPublic: boolean;
}
