import { Document, Types } from "mongoose";
import { REACTIONS } from "../config/constants";

export interface BlogDocument extends Document {
    readonly _id: Types.ObjectId;
    title: string;
    description: string;
    banner: string;
    slug: string;
    content: string;
    author: Types.ObjectId;
    coAuthor: Types.ObjectId;
    isPublic: boolean;
}

export interface CommentDocument extends Document {
    readonly _id: Types.ObjectId;
    user: Types.ObjectId;
    blog: Types.ObjectId;
    content: string;
    parent?: Types.ObjectId;
    isEdited?: boolean;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReactionDocument extends Document {
    readonly _id: Types.ObjectId;
    blog?: Types.ObjectId;
    comment?: Types.ObjectId;
    user: Types.ObjectId;
    reaction: REACTIONS;
}

export interface UserDocument extends Document {
    readonly _id: Types.ObjectId;
    name: string;
    email: string;
    picture?: string;
    isAdmin: boolean;
    searches: SearchDocument[];
    generateAuthToken: () => string;
    storeSearchResult: (query: string) => void;
}

export interface SearchDocument extends Document {
    readonly _id: Types.ObjectId;
    query: string;
    blog?: Types.ObjectId;
    createdAt: Date;
}

export interface LoggerDocument extends Document {
    readonly _id: Types.ObjectId;
    method: string;
    route: string;
    statusCode: number;
    headers: Record<string, unknown>;
    query: Record<string, unknown>;
    body: Record<string, unknown>;
    response: Record<string, unknown>;
    createdAt: Date;
}
