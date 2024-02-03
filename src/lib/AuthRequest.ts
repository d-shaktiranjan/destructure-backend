import { Request } from "express";
import { UserDocument } from "../models/User.model";

export interface AuthRequest extends Request {
    user?: UserDocument;
}
