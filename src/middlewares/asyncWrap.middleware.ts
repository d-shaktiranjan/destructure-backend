import { Request, Response, NextFunction, RequestHandler } from "express";
import { errorResponse } from "../utils/apiResponse.util";
import { DEBUG } from "../config/constants";
import { APP_MESSAGES } from "../config/messages";

const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            const message = DEBUG ? error.message : APP_MESSAGES.ERROR;
            try {
                return errorResponse(res, message, 500);
            } catch (error) {
                console.log(error);
            }
        });
    };
};

export default asyncWrapper;
