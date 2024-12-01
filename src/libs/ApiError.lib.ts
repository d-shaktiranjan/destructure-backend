type ApiErrorType = Record<string, string | string[]> | null;

class ApiError extends Error {
    statusCode: number;
    errors: ApiErrorType;
    constructor(
        message: string,
        statusCode: number = 400,
        errors: ApiErrorType = null,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export default ApiError;
