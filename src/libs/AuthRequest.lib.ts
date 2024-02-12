import { Request } from "express";
import { UserDocument } from "./UserDocument.lib";

export interface AuthRequest extends Request {
    user?: UserDocument;
}
