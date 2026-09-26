export class AppError extends Error {
    public readonly statusCode: number;
    public readonly error: any;

    constructor(message: string, statusCode = 500, error: any = null) {
        super(message);
        this.statusCode = statusCode;
        this.error = error ?? message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found with matching filter", err: any = null) {
        super(message, 404, err);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = "Bad request", err: any = null) {
        super(message, 400, err);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized", err: any = null) {
        super(message, 401, err);
    }
}

