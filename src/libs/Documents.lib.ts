import { Document, Schema } from "mongoose";
import { REACTIONS } from "../config/constants";

export interface BlogDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    content: string;
    author: Schema.Types.ObjectId;
    coAuthor: Schema.Types.ObjectId;
    isPublic: boolean;
}

export interface CommentDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    blog: Schema.Types.ObjectId;
    content: string;
    parent?: Schema.Types.ObjectId;
    isEdited?: boolean;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReactionDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    blog?: Schema.Types.ObjectId;
    comment?: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    reaction: REACTIONS;
}

export interface UserDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    picture?: string;
    isAdmin: boolean;
    searches: SearchDocument[];
    generateAuthToken: () => string;
}

export interface SearchDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    query: string;
    blog?: Schema.Types.ObjectId;
    createdAt: Date;
}
