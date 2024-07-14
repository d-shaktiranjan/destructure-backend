// package imports
import { Response, NextFunction } from "express";

import User from "../models/User.model";
import asyncWrapper from "./asyncWrap.middleware";

import { errorResponse } from "../utils/apiResponse.util";
import { AUTH_MESSAGES } from "../config/messages";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { UserDocument } from "../libs/Documents.lib";

export const isAuthenticated = asyncWrapper(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = (await decodeToken(req, res)) as UserDocument;
        if (!user) return errorResponse(res, AUTH_MESSAGES.MISSING_TOKEN);

        req.user = user;
        next();
    },
);

export const allowBoth = asyncWrapper(
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
    // collect JWT from cookies or header
    const authToken =
        req.cookies?.authToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!authToken) return null;

    try {
        const userInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
        );

        if (!userInfo.ok) {
            return errorResponse(res, AUTH_MESSAGES.FAILED);
        }

        const userPayload = await userInfo.json();

        // Store user in the database
        let userObject = await User.findOne({ email: userPayload.email });
        if (userObject) {
            userObject.name = userPayload.name || "";
            userObject.picture = userPayload.picture;
        } else {
            userObject = new User({
                name: userPayload.name,
                email: userPayload.email,
                picture: userPayload.picture,
            });
        }
        await userObject.save();
        return userObject;
    } catch (error) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN);
    }
}
