import { PORT } from "./constants";

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
    UNABLE_TO_LOGIN = "Unable to login due to mismatch origin.",
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
    AUTHORSHIP = "Author & co-author must be different",
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

export enum USER_MESSAGES {
    NOT_FOUND = "User not found with this given details",
}

export enum GENERIC_MESSAGES {
    NOT_ALLOWED = "You are not allowed to perform this action",
    INVALID_ID = "Invalid object ID",
}
