// package imports
import { Request, Response } from "express";

// config imports
import { COOKIES_OPTIONS, CORS_ORIGINS } from "../config/constants";
import { AUTH_MESSAGES } from "../config/messages";

// model & libs imports
import User from "../models/User.model";
import { AuthRequest } from "../libs/AuthRequest.lib";

// util & middlewares imports
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { getOAuth2Client } from "../services/auth.service";

let oAuth2Client = getOAuth2Client();

export const googleLogin = asyncWrapper(async (req: Request, res: Response) => {
    // check origin
    const requestOrigin = req.headers.referer;
    if (!requestOrigin || !CORS_ORIGINS.includes(requestOrigin))
        return errorResponse(res, AUTH_MESSAGES.UNABLE_TO_LOGIN, 406);

    // update oAuth client based on origin
    oAuth2Client = getOAuth2Client(`${requestOrigin}api/auth`);

    const redirectUrl = oAuth2Client.generateAuthUrl({
        scope: ["profile", "email"],
    });
    res.redirect(redirectUrl);
});

export const googleCallback = asyncWrapper(
    async (req: Request, res: Response) => {
        const { token } = req.query;

        const userInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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

        // Generate a JWT and set it as a cookie
        const jwt = userObject.generateAuthToken();
        res.cookie("authToken", jwt, COOKIES_OPTIONS);

        return successResponse(res, AUTH_MESSAGES.LOGIN, 200, {
            jwt,
            user: userObject,
        });
    },
);

export const logout = (req: Request, res: Response) => {
    res.clearCookie("authToken", COOKIES_OPTIONS);
    return successResponse(res, AUTH_MESSAGES.LOGOUT);
};

export const profile = asyncWrapper(async (req: AuthRequest, res: Response) => {
    return successResponse(res, AUTH_MESSAGES.PROFILE, 200, req.user);
});
