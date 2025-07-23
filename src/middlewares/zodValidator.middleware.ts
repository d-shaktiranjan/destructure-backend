import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { APP_MESSAGES } from "../config/messages";
import { errorResponse } from "../utils/apiResponse.util";

const zodValidator =
    (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string[]> = {};
                for (const er of error.issues) {
                    const key = er.path instanceof Array ? er.path[0] : er.path;
                    errors[key.toString()] = [er.message];
                }
                return errorResponse(res, APP_MESSAGES.VALIDATION_ERROR, {
                    errors,
                    statusCode: 400,
                });
            }
            return errorResponse(res, APP_MESSAGES.VALIDATION_ERROR);
        }
    };

export default zodValidator;
