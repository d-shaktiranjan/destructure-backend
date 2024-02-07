import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    AUTH_MESSAGES,
    COOKIES_OPTIONS,
} from "../config/constants";
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import User from "../models/User.model";
import { AuthRequest } from "../libs/AuthRequest.lib";

const oAuth2Client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
});

export const googleLogin = asyncWrapper(async (req: Request, res: Response) => {
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
        res.cookie("authToken", jwt, COOKIES_OPTIONS);

        return successResponse(res, AUTH_MESSAGES.LOGIN, 200, userObject);
    },
);

export const logout = (req: Request, res: Response) => {
    res.clearCookie("authToken", COOKIES_OPTIONS);
    return successResponse(res, AUTH_MESSAGES.LOGOUT);
};

export const profile = asyncWrapper(async (req: AuthRequest, res: Response) => {
    return successResponse(res, AUTH_MESSAGES.PROFILE, 200, req.user);
});
