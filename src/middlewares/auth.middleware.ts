// package imports
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import User from "../models/User.model";
import asyncWrapper from "./asyncWrap.middleware";

import { errorResponse } from "../utils/apiResponse.util";
import { JWT_SECRET } from "../config/constants";
import { AuthRequest } from "../lib/AuthRequest";

export const isAuthenticated = asyncWrapper(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        // collect JWT from cookies or header
        const authToken =
            req.cookies?.authToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!authToken) return errorResponse(res, "");

        try {
            // decode JWT
            const decodedValue = verify(authToken, JWT_SECRET) as {
                _id: string;
            };

            // fetch user from DB
            const user = await User.findById(decodedValue?._id);
            if (!user) return errorResponse(res, "Invalid token", 401);

            req.user = user;
            next();
        } catch (error) {
            return errorResponse(res, "");
        }
    },
);
