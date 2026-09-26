import { Response } from "express";
import { AppError } from "@/errors";

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse<E = any> {
  success: false;
  message: string;
  error: E;
}

export type ApiResponsePayload<T = any, E = any> = ApiSuccessResponse<T> | ApiErrorResponse<E>;

/**
 * Standardized API Response utility.
 * Guarantees uniform structure:
 * - Success: { success: true, message: string, data: T }
 * - Error:   { success: false, message: string, error: E }
 */
export class ApiResponse {
  /**
   * Returns a standardized success JSON response.
   */
  public static success<T>(
    res: Response,
    data: T,
    message = "Operation successful",
    statusCode = 200
  ): Response {
    const payload: ApiSuccessResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(payload);
  }

  /**
   * Returns a standardized error JSON response.
   */
  public static error<E = any>(
    res: Response,
    message = "Operation failed",
    error?: E,
    statusCode = 400
  ): Response {
    const payload: ApiErrorResponse<E> = {
      success: false,
      message,
      error: (error !== undefined && error !== null ? error : message) as E,
    };
    return res.status(statusCode).json(payload);
  }

  /**
   * Throws an AppError formatted for the global error handler.
   */
  public static throw(
    message: string,
    statusCode = 400,
    error?: any
  ): never {
    throw new AppError(message, statusCode, error ?? message);
  }
}

export const sendSuccess = ApiResponse.success;
export const sendError = ApiResponse.error;
export const throwApiError = ApiResponse.throw;
