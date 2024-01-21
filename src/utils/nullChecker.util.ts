import { Response } from "express";
import { errorResponse } from "./apiResponse.util";
import { APP_MESSAGES } from "../config/constants";

const nullChecker = (res: Response, elementObject: object) => {
    for (const [key, value] of Object.entries(elementObject)) {
        if (!value || value.trim() === "")
            return errorResponse(res, key + APP_MESSAGES.MISSING);
    }
};

export default nullChecker;
