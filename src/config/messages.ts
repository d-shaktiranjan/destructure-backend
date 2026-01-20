import { PORT } from "./constants";

export const APP_MESSAGES = {
    RUNNING: `App is running on ${PORT}`,
    ERROR: "Some error occurred",
    VALIDATION_ERROR: "Schema validation error",
    INVALID_SUCCESS_CODE:
        "Status code for success response must be in the 2xx range.",
    INVALID_ERROR_CODE:
        "Status code for error response must be in the 4xx or 5xx range.",
} as const;

export enum AUTH_MESSAGES {
    LOGIN = "Login success",
    FAILED = "Login failed",
    PROFILE = "Profile details fetched",
    MISSING_TOKEN = "Auth token is missing",
    INVALID_TOKEN = "Invalid auth token provided",
    NOT_AUTHENTICATED = "Login to continue",
    NOT_ADMIN = "You are not allowed to do this",
    UNABLE_TO_LOGIN = "Unable to login due to mismatch origin.",
    LOGOUT_SUCCESS = "Logout successful",
}

export enum DB_MESSAGES {
    CONNECTED = "Successfully connected to MongoDB",
    FAILED = "Unable to connect to DB",
}

export enum BLOG_MESSAGES {
    CREATED = "Blog Created",
    ALREADY_EXITS = "Blog already exits.",
    ALL_FETCHED = "All Blog fetched.",
    BLOG_FETCHED = "Blog details fetched",
    BLOG_NOT_FOUND = "Blog not found",
    KEY_NOT_ALLOWED = " key is not allowed to update.",
    UNIQUE_TITLE = "Title must be unique",
    UPDATED = "Blog updated successfully",
    AUTHORSHIP = "Author & co-author must be different",
    CO_AUTHOR_ADD_FAILED = "Unable to set co-author",
    SLUG_UNIQUE = "Slug is unique",
    SLUG_NOT_UNIQUE = "Slug is not unique",
    SLUG_GENERATED = "Unique slug generated",
    DELETED = "Blog deleted successfully",
}

export enum REACTION_MESSAGES {
    ADDED = "Reaction added",
    REMOVED = "Reaction removed",
    UPDATED = "Reaction updated",
    LIST = "Reaction list fetched",
}

export enum COMMENT_MESSAGES {
    ADDED = "Comment added",
    NOT_FOUND = "Comment not found",
    DELETED = "Comment deleted",
    UPDATED = "Comment updated",
    UNABLE_TO_UPDATE = "Can't update this comment",
    LIST_FETCHED = "Comment list fetched",
    REPLY_LIST = "Reply list fetched",
    REPLY_ADDED = "Reply added",
    SOFT_DELETE = "Soft delete success",
    SOFT_DELETE_VALUE = "This comment is deleted by an admin",
}

export enum USER_MESSAGES {
    NOT_FOUND = "User not found with this given details",
}

export enum GENERIC_MESSAGES {
    NOT_ALLOWED = "You are not allowed to perform this action",
    INVALID_ID = "Invalid object ID",
    FIELD_ERROR = "Some field errors",
    KEY_MISSING_OR_NULL = "This field is missing or null value provided",
}

export enum SEARCH_MESSAGES {
    RESULT_FETCHED = "Search result fetched",
    HISTORY_FETCHED = "Search history fetched",
    NOT_FOUND = "Search result not found",
    HISTORY_DELETED = "Search history deleted",
    LINK_BLOG_IN_QUERY = "Blog linked with the query",
}

export enum MEDIA_MESSAGES {
    LIST_FETCHED = "Media list fetched",
    MEDIA_UPLOADED = "Files uploaded successfully",
    NO_FILES = "No files uploaded",
    INVALID_FILE_FORMAT = "Invalid file format",
}

export enum ADMIN_MESSAGES {
    LIST = "Admin list fetched",
    ADDED = "User added as admin",
    REMOVED = "User removed as admin",
    NOT_FOUND = "Admin not found",
    ALREADY_EXISTS = "User is already an admin",
}
