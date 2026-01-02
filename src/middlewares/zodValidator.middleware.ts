import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { APP_MESSAGES } from "../config/messages";
import { errorResponse } from "../utils/apiResponse.util";

type DataPickFrom = "body" | "query" | "params";
const zodValidator =
    (schema: z.Schema, dataPickFrom: DataPickFrom = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (dataPickFrom === "body") req.body = schema.parse(req.body);
            else if (dataPickFrom === "query")
                req.query = schema.parse(req.query) as Request["query"];
            else if (dataPickFrom === "params")
                req.params = schema.parse(req.params) as Request["params"];
            else throw new Error("Invalid dataPickFrom value");
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
