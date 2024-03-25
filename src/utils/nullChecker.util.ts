import { Response } from "express";
import { errorResponse } from "./apiResponse.util";
import { APP_MESSAGES } from "../config/messages";

const nullChecker = (res: Response, elementObject: object): null | Response => {
    for (const [key, value] of Object.entries(elementObject)) {
        if (!value || value.trim() === "")
            return errorResponse(res, key + APP_MESSAGES.MISSING);
    }
    return null;
};

export default nullChecker;
