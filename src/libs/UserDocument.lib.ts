import { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    picture?: string;
    isAdmin: boolean;
    generateAuthToken: () => string;
}
