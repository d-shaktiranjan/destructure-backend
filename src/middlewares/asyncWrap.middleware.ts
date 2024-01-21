import { Request, Response, NextFunction, RequestHandler } from "express";
import { errorResponse } from "../utils/apiResponse.util";
import { APP_MESSAGES } from "../config/constants";

const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            return errorResponse(res, error.message || APP_MESSAGES.ERROR, 500);
        });
    };
};

export default asyncWrapper;
