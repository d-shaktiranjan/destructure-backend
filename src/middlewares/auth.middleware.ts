// package imports
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import User from "../models/User.model";
import aw from "./asyncWrap.middleware";

import { errorResponse } from "../utils/apiResponse.util";
import { JWT_SECRET } from "../config/constants";
import { AUTH_MESSAGES } from "../config/messages";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { UserDocument } from "../libs/Documents.lib";

export const isAuthenticated = aw(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = (await decodeToken(req, res)) as UserDocument;
        if (!user) return errorResponse(res, AUTH_MESSAGES.MISSING_TOKEN);

        req.user = user;
        next();
    },
);

export const allowBoth = aw(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = (await decodeToken(req, res)) as UserDocument;
        if (user) req.user = user;
        next();
    },
);

export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const user = req.user;
    // check login status
    if (!user) return errorResponse(res, AUTH_MESSAGES.NOT_AUTHENTICATED, 401);

    // check admin status
    if (!user.isAdmin) return errorResponse(res, AUTH_MESSAGES.NOT_ADMIN, 401);

    next();
};

async function decodeToken(req: AuthRequest, res: Response) {
    // collect JWT from header
    const authToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!authToken) return null;

    try {
        // decode JWT
        const decodedValue = verify(authToken, JWT_SECRET) as {
            _id: string;
        };

        // fetch user from DB
        const user = await User.findById(decodedValue?._id).select("-__v");
        if (!user) return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN);
        return user;
    } catch (error) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN);
    }
}
