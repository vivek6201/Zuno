import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../../constants/config";
import { ApiErrorResponse, ApiResponse, isApiErrorResponse } from "./types";

/**
 * Standard typed client error representing backend error responses.
 */
export class ApiClientError<E = unknown> extends Error implements ApiErrorResponse<E> {
    public readonly success = false as const;
    public readonly statusCode?: number;
    public readonly error: E;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        statusCode?: number,
        error?: E,
        originalError?: unknown
    ) {
        super(message);
        this.name = "ApiClientError";
        this.statusCode = statusCode;
        this.error = (error !== undefined && error !== null ? error : message) as E;
        this.originalError = originalError;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Shared Axios instance configured with backend API base URL and credentials.
 */
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let authToken: string | null = null;

/**
 * Configure the Bearer auth token for all subsequent API requests.
 */
export const setAuthToken = (token: string | null): void => {
    authToken = token;
};

/**
 * Get current configured auth token.
 */
export const getAuthToken = (): string | null => authToken;

// Interceptor to attach Authorization header if authToken exists
axiosInstance.interceptors.request.use((config) => {
    if (authToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Interceptor to intercept 4xx/5xx responses and convert them into ApiClientError
axiosInstance.interceptors.response.use(
    (response) => response,
    (axiosError: AxiosError<ApiErrorResponse>) => {
        const errorData = axiosError.response?.data;
        if (errorData && typeof errorData === "object" && "message" in errorData) {
            throw new ApiClientError(
                errorData.message,
                axiosError.response?.status,
                errorData.error,
                axiosError
            );
        }

        throw new ApiClientError(
            axiosError.message || "Network request failed",
            axiosError.response?.status,
            axiosError.message,
            axiosError
        );
    }
);

/**
 * Send an API request using the configured client and return the response data payload.
 */
export const api = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return response.data;
};

/**
 * Safe execution wrapper: catches ApiClientError and returns the typed ApiResponse union.
 * Returns either ApiSuccessResponse<T> or ApiErrorResponse<E> without throwing.
 */
export const safeApi = async <T = unknown, E = unknown>(
    promiseOrConfig: Promise<T> | AxiosRequestConfig
): Promise<ApiResponse<T, E>> => {
    try {
        const data = typeof (promiseOrConfig as any)?.then === "function"
            ? await (promiseOrConfig as Promise<T>)
            : await api<T>(promiseOrConfig as AxiosRequestConfig);
        return data as any;
    } catch (err) {
        if (err instanceof ApiClientError) {
            return {
                success: false,
                message: err.message,
                error: err.error as E,
            };
        }
        return {
            success: false,
            message: (err as Error)?.message || "Unknown error occurred",
            error: (err as any)?.message ?? err,
        };
    }
};


api.get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api<T>({ ...config, method: "GET", url });

api.post = <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api<T>({ ...config, method: "POST", url, data });

api.put = <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api<T>({ ...config, method: "PUT", url, data });

api.patch = <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api<T>({ ...config, method: "PATCH", url, data });

api.delete = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api<T>({ ...config, method: "DELETE", url });