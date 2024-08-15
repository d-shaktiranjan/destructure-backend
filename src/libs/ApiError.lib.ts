class ApiError extends Error {
    statusCode: number;
    errors: Record<string, string[]> | null;
    constructor(
        message: string,
        statusCode: number = 400,
        errors: Record<string, string[]> | null = null,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export default ApiError;
