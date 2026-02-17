import axios from "axios";

/**
 * Axios instance configured for the Room Booking API
 * 
 * Base URL is configured via NEXT_PUBLIC_API_BASE_URL environment variable
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API Response envelope structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Response interceptor to unwrap data envelope and enforce backend contract
 */
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Check if response matches API envelope structure
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      "data" in data
    ) {
      // Backend returned success: false - treat as error
      if (data.success === false) {
        const apiError: ApiError = {
          message: data.message || "Operation failed",
          errors: data.errors || undefined,
        };
        return Promise.reject(apiError);
      }

      // Success - unwrap data
      return {
        ...response,
        data: data.data,
      };
    }

    // Not an envelope response - pass through as-is
    return response;
  },
  (error) => {
    // HTTP error (4xx, 5xx)
    if (error.response?.data) {
      const data = error.response.data;

      const apiError: ApiError = {
        message: data.message || error.message || "An error occurred",
        errors: data.errors || undefined,
      };
      return Promise.reject(apiError);
    }

    // Network error or request configuration error
    return Promise.reject({
      message: error.message || "Network error",
    } as ApiError);
  }
);
