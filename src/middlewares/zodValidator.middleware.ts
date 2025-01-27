import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/apiResponse.util";
import { APP_MESSAGES } from "../config/messages";

const zodValidator =
    (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string[]> = {};
                for (const er of error.errors) {
                    const key = er.path instanceof Array ? er.path[0] : er.path;
                    errors[key] = [er.message];
                }
                return errorResponse(
                    res,
                    APP_MESSAGES.VALIDATION_ERROR,
                    400,
                    errors,
                );
            }
            return errorResponse(res, APP_MESSAGES.VALIDATION_ERROR);
        }
    };

export default zodValidator;
