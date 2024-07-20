import { Request, Response, NextFunction, RequestHandler } from "express";
import { errorResponse } from "../utils/apiResponse.util";
import { DEBUG } from "../config/constants";
import { APP_MESSAGES } from "../config/messages";
import ApiError from "../libs/ApiError.lib";

const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch(
            (error: ApiError) => {
                const message = DEBUG ? error.message : APP_MESSAGES.ERROR;
                return errorResponse(res, message, error.statusCode || 500);
            },
        );
    };
};

export default asyncWrapper;
