import { OAuth2Client } from "google-auth-library";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
} from "../config/constants";

export const getOAuth2Client = (redirectUri = GOOGLE_REDIRECT_URI) => {
    return new OAuth2Client({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri,
    });
};
