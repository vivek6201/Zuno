/**
 * Standard successful API response payload returned by the backend.
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard error API response payload returned by the backend.
 */
export interface ApiErrorResponse<E = unknown> {
  success: false;
  message: string;
  error: E;
}

/**
 * Standard API response envelope returned by the backend,
 * discriminated by the `success` boolean field.
 */
export type ApiResponse<T = unknown, E = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse<E>;

/**
 * Alias matching the backend ApiResponsePayload type.
 */
export type ApiResponsePayload<T = unknown, E = unknown> = ApiResponse<T, E>;

/**
 * Type guard to check if an API response is successful.
 */
export function isApiSuccessResponse<T, E = unknown>(
  response: ApiResponse<T, E>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if an API response is an error.
 */
export function isApiErrorResponse<T = unknown, E = unknown>(
  response: ApiResponse<T, E>
): response is ApiErrorResponse<E> {
  return response.success === false;
}
