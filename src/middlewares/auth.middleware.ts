// package imports
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import User from "../models/User.model";
import asyncWrapper from "./asyncWrap.middleware";

import { errorResponse } from "../utils/apiResponse.util";
import { JWT_SECRET, AUTH_MESSAGES } from "../config/constants";
import { AuthRequest } from "../lib/AuthRequest";

export const isAuthenticated = asyncWrapper(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        // collect JWT from cookies or header
        const authToken =
            req.cookies?.authToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!authToken) return errorResponse(res, AUTH_MESSAGES.MISSING_TOKEN);

        try {
            // decode JWT
            const decodedValue = verify(authToken, JWT_SECRET) as {
                _id: string;
            };

            // fetch user from DB
            const user = await User.findById(decodedValue?._id).select(
                "-_id -__v",
            );
            if (!user) return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN);

            req.user = user;
            next();
        } catch (error) {
            return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN);
        }
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
