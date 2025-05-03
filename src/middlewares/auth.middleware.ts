// package imports
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import User from "../models/User.model";
import aw from "./asyncWrap.middleware";

import { JWT_SECRET } from "../config/constants";
import { AUTH_MESSAGES } from "../config/messages";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { UserDocument } from "../libs/Documents.lib";
import ApiError from "../libs/ApiError.lib";

export const isAuthenticated = aw(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = (await decodeToken(req)) as UserDocument;
        if (!user) throw new ApiError(AUTH_MESSAGES.MISSING_TOKEN);

        req.user = user;
        next();
    },
);

export const allowBoth = aw(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = (await decodeToken(req)) as UserDocument;
        if (user) req.user = user;
        next();
    },
);

export const isAdmin = aw(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        // check login status
        if (!user) throw new ApiError(AUTH_MESSAGES.NOT_AUTHENTICATED, 401);

        // check admin status
        if (!user.isAdmin) throw new ApiError(AUTH_MESSAGES.NOT_ADMIN, 401);

        next();
    },
);

async function decodeToken(req: AuthRequest) {
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
        if (!user) throw new ApiError(AUTH_MESSAGES.INVALID_TOKEN);
        return user;
    } catch (error) {
        if (error instanceof Error)
            throw new ApiError(AUTH_MESSAGES.INVALID_TOKEN, 400, {
                error: error.message,
            });
        throw new ApiError(AUTH_MESSAGES.INVALID_TOKEN);
    }
}
