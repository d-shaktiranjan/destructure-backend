import { Request } from "express";
import { UserDocument } from "./Documents.lib";

export interface AuthRequest extends Request {
    user?: UserDocument;
}
