import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors";
import { ApiResponse } from "@/utils/response";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        return ApiResponse.error(
            res,
            err.message,
            err.error,
            err.statusCode
        );
    }

    console.error("Unhandled Error:", err);
    return ApiResponse.error(
        res,
        "Internal server error",
        process.env.NODE_ENV !== "production" ? { message: err.message, stack: err.stack } : "Internal server error",
        500
    );
};

