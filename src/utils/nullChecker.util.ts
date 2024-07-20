import { Response } from "express";
import { APP_MESSAGES } from "../config/messages";
import ApiError from "../libs/ApiError.lib";

const nullChecker = (res: Response, elementObject: object) => {
    for (const [key, value] of Object.entries(elementObject)) {
        if (!value || value.trim() === "")
            throw new ApiError(key + APP_MESSAGES.MISSING);
    }
};

export default nullChecker;
