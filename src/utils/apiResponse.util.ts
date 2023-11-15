import { Response } from "express";

const apiResponse = (
    res: Response,
    message: string,
    statusCode: number = 200,
    data: object | null = null,
    isSuccess: boolean = true
): Response => {
    const responseObject = {
        isSuccess,
        message,
        ...(data && { data }),
    };
    return res.status(statusCode).json(responseObject);
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400
): Response => {
    return apiResponse(res, message, statusCode, null, false);
};

export default apiResponse;
