import { Document, Schema } from "mongoose";
import { REACTIONS } from "../config/constants";

export interface BlogDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    banner: string;
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
    storeSearchResult: (query: string) => void;
}

export interface SearchDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    query: string;
    blog?: Schema.Types.ObjectId;
    createdAt: Date;
}

export interface LoggerDocument extends Document {
    readonly _id: Schema.Types.ObjectId;
    method: string;
    route: string;
    statusCode: number;
    headers: Record<string, unknown>;
    query: Record<string, unknown>;
    body: Record<string, unknown>;
    response: Record<string, unknown>;
    createdAt: Date;
}
