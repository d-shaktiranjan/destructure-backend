// package imports
import { Request, Response } from "express";

// config imports
import { GOOGLE_CLIENT_ID, CORS_ORIGINS } from "../config/constants";
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
        const { code } = req.query;

        const { tokens } = await oAuth2Client.getToken(code as string);
        oAuth2Client.setCredentials(tokens);

        const user = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: GOOGLE_CLIENT_ID,
        });
        if (!user) return errorResponse(res, AUTH_MESSAGES.FAILED);
        const userPayload = user.getPayload();

        // store user in DB
        let userObject = await User.findOne({ email: userPayload?.email });
        if (userObject) {
            userObject.name = userPayload?.name || "";
            userObject.picture = userPayload?.picture;
        } else {
            userObject = new User({
                name: userPayload?.name,
                email: userPayload?.email,
                picture: userPayload?.picture,
            });
        }
        await userObject.save();
        const jwt = userObject.generateAuthToken();

        return successResponse(res, AUTH_MESSAGES.LOGIN, 200, {
            jwt,
            user: userObject,
        });
    },
);

export const profile = asyncWrapper(async (req: AuthRequest, res: Response) => {
    return successResponse(res, AUTH_MESSAGES.PROFILE, 200, req.user);
});
