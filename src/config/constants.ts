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

export const COOKIES_OPTIONS = { secure: true, httpOnly: true };

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
}

export enum DB_MESSAGES {
    CONNECTED = "DB Connected",
    FAILED = "Unable to connect to DB",
}

export enum BLOG_MESSAGES {
    CREATED = "Blog Created",
    ALREADY_EXITS = "Blog already exits.",
    ALL_FETCHED = "All Blog fetched.",
}
