import { Response } from "express";

const apiResponse = (
    res: Response,
    message: string,
    statusCode: number,
    data: object | null = null,
    metaData: object | null = null,
    isSuccess: boolean = true
): Response => {
    const responseObject = {
        isSuccess,
        message,
        ...(metaData && { metaData }),
        ...(data && { data }),
    };
    return res.status(statusCode).json(responseObject);
};

export const successResponse = (
    res: Response,
    message: string,
    statusCode: number = 200,
    data: object | null = null,
    metaData: object | null = null
): Response => apiResponse(res, message, statusCode, data, metaData, true);

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400
): Response => apiResponse(res, message, statusCode, null, null, false);
