// ########## start environment variables ##########
export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
export const DEBUG: boolean = process.env.DEBUG === "true";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const AUTH_TOKEN_EXPIRY: string = process.env.AUTH_TOKEN_EXPIRY || "3d";

// google oAuth constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const CORS_ORIGINS: string[] = eval(process.env.CORS_ORIGINS || "");
// ########## end environment variables ##########

export const COOKIES_OPTIONS = { secure: true, httpOnly: true } as const;

// reactions
export enum REACTIONS {
    LIKE = "LIKE",
    FIRE = "FIRE",
    SMILE = "SMILE",
    LAUGHING = "LAUGHING",
    HEART = "HEART",
    THINKING = "THINKING",
    DISLIKE = "DISLIKE",
}

export const ALLOWED_IMAGE_MIMETYPE: readonly string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
];

export const SEARCH_ARRAY_MAX_LENGTH = 5;
