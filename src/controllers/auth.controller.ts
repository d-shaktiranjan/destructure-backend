import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
} from "../config/constants";
import asyncWrapper from "../middlewares/asyncWrap.middleware";

const oAuth2Client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
});

export const googleLogin = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const redirectUrl = oAuth2Client.generateAuthUrl({
            scope: ["profile", "email"],
        });
        res.redirect(redirectUrl);
    }
);

export const googleCallback = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const { code } = req.query;

        const { tokens } = await oAuth2Client.getToken(code as string);
        oAuth2Client.setCredentials(tokens);

        const user = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: GOOGLE_CLIENT_ID,
        });
        req.session.user = user.getPayload();
        res.redirect("/");
    }
);

export const logout = (req: Request, res: Response): void => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
