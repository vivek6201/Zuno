import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.error && { error: err.error }),
        });
    }

    console.error("Unhandled Error:", err);
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
        ...(process.env.NODE_ENV !== "production" && { error: err.message, stack: err.stack }),
    });
};
