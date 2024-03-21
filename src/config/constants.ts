// environment variables
export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
export const DEBUG: boolean = process.env.DEBUG === "true";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const AUTH_TOKEN_EXPIRY: string = process.env.AUTH_TOKEN_EXPIRY || "3d";

// google oAuth constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

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

export const APP_MESSAGES = {
    HELLO: "Hello from Express",
    RUNNING: `App is running on ${PORT}`,
    ERROR: "Some error occurred",
    MISSING: " is missing",
} as const;

export enum AUTH_MESSAGES {
    LOGIN = "Login success",
    LOGOUT = "Logout success",
    FAILED = "Login failed",
    PROFILE = "Profile details fetched",
    MISSING_TOKEN = "Auth token is missing",
    INVALID_TOKEN = "Invalid auth token provided",
    NOT_AUTHENTICATED = "Login to continue",
    NOT_ADMIN = "You are not allowed to do this",
}

export enum DB_MESSAGES {
    CONNECTED = "DB Connected",
    FAILED = "Unable to connect to DB",
}

export enum BLOG_MESSAGES {
    CREATED = "Blog Created",
    ALREADY_EXITS = "Blog already exits.",
    ALL_FETCHED = "All Blog fetched.",
    BLOG_FETCHED = "Blog details fetched",
    SLUG_MISSING = "Blog slug missing",
    BLOG_NOT_FOUND = "Blog not found",
    KEY_NOT_ALLOWED = " key is not allowed to update.",
    IS_PUBLIC_TYPE = "isPublic must be a bool value",
    UNIQUE_TITLE = "Title must be unique",
    UPDATED = "Blog updated successfully",
    IMAGE_REQUIRED = "Image required",
    IMAGE_UPLOADED = "Image upload successfully",
}

export enum REACTION_MESSAGES {
    ADDED = "Reaction added",
    REMOVED = "Reaction removed",
    INVALID = "Invalid reaction",
    UPDATED = "Reaction updated",
}

export enum COMMENT_MESSAGES {
    ADDED = "Comment added",
    NOT_FOUND = "Comment not found",
    DELETED = "Comment deleted",
}

export enum GENERIC_MESSAGE {
    NOT_ALLOWED = "You are not allowed to perform this action",
}
