import { Response } from "express";

const apiResponse = (
    res: Response,
    message: string,
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        isSuccess: statusCode < 400,
        message,
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400
) => {
    return apiResponse(res, message, statusCode);
};

export default apiResponse;
