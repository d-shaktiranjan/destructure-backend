import { NextFunction, Request, RequestHandler, Response } from "express";
import { DEBUG } from "../config/constants";
import { APP_MESSAGES } from "../config/messages";
import ApiError from "../libs/ApiError.lib";
import { errorResponse } from "../utils/apiResponse.util";

const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch(
            (error: ApiError) => {
                const message = DEBUG ? error.message : APP_MESSAGES.ERROR;
                return errorResponse(res, message, {
                    statusCode: error.statusCode || 500,
                });
            },
        );
    };
};

export default asyncWrapper;
