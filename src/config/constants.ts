// environment variables
export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// google oAuth constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const APP_MESSAGES = {
    HELLO: "Hello from Express",
    RUNNING: `App is running on ${PORT}`,
    ERROR: "Some error occurred",
    MISSING: " is missing",
};

export const DB_MESSAGES = {
    CONNECTED: "DB Connected",
    FAILED: "Unable to connect to DB",
};

export const BLOG_MESSAGES = {
    CREATED: "Blog Created",
    ALREADY_EXITS: "Blog already exits.",
};
