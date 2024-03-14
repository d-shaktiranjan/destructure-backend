import { Request, Response, NextFunction, RequestHandler } from "express";
import { errorResponse } from "../utils/apiResponse.util";
import { APP_MESSAGES, DEBUG } from "../config/constants";

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
