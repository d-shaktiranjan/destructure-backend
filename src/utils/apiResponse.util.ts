import { GENERIC_MESSAGES } from "../config/messages";
import { Response } from "express";

const apiResponse = (
    res: Response,
    message: string,
    statusCode: number,
    data: object | null = null,
    metaData: object | null = null,
    isSuccess: boolean = true,
    errors: Record<string, string[]> | null,
): Response => {
    const responseObject = {
        isSuccess,
        message,
        ...(metaData && { metaData }),
        ...(data && { data }),
        ...(errors && { errors }),
    };
    return res.status(statusCode).json(responseObject);
};

export const successResponse = (
    res: Response,
    message: string,
    statusCode: number = 200,
    data: object | null = null,
    metaData: object | null = null,
): Response =>
    apiResponse(res, message, statusCode, data, metaData, true, null);

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400,
    errors: Record<string, string[]> | null = null,
): Response => apiResponse(res, message, statusCode, null, null, false, errors);

export const noContentResponse = (res: Response): Response =>
    successResponse(res, GENERIC_MESSAGES.NO_CONTENT, 204);
