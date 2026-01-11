// package imports
import { Request, Response } from "express";

// config imports
import {
    COOKIE_OPTIONS,
    CORS_ORIGINS,
    GOOGLE_CLIENT_ID,
} from "../config/constants";
import { AUTH_MESSAGES } from "../config/messages";

// model & libs imports
import { AuthRequest } from "../libs/CustomInterface.lib";
import User from "../models/User.model";

// util & middlewares imports
import aw from "../middlewares/asyncWrap.middleware";
import { getOAuth2Client } from "../services/auth.service";
import { errorResponse, successResponse } from "../utils/apiResponse.util";

let oAuth2Client = getOAuth2Client();

export const googleLogin = aw(async (req: Request, res: Response) => {
    // check origin
    const state = (req.query.state as string) || "/";
    const requestOrigin = req.headers.referer;
    if (!requestOrigin || !CORS_ORIGINS.includes(requestOrigin))
        return errorResponse(res, AUTH_MESSAGES.UNABLE_TO_LOGIN, {
            statusCode: 406,
        });

    // update oAuth client based on origin
    oAuth2Client = getOAuth2Client(`${requestOrigin}api/auth`);

    const redirectUrl = oAuth2Client.generateAuthUrl({
        scope: ["profile", "email"],
        state,
    });
    res.redirect(redirectUrl);
});

export const googleCallback = aw(async (req: Request, res: Response) => {
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

    res.cookie("token", jwt, COOKIE_OPTIONS);

    return successResponse(res, AUTH_MESSAGES.LOGIN, {
        data: {
            jwt,
        },
    });
});

export const profile = aw(async (req: AuthRequest, res: Response) => {
    return successResponse(res, AUTH_MESSAGES.PROFILE, { data: req.user });
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    return successResponse(res, AUTH_MESSAGES.LOGOUT_SUCCESS);
};
