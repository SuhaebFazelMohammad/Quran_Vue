/**
 * API Client
 * Centralized Axios instance with base configuration
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_URL, API_TIMEOUT } from "./config";
import { useUserStore } from "../stores/userStore";

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    const token = userStore.token;

    // Add authorization token if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Enhanced error logging for debugging
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Clear auth and redirect to login
    // But don't redirect if we're already on login page (to avoid loops)
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      // Only logout if we have a token (avoid logout on login attempt)
      if (userStore.token && window.location.pathname !== "/login") {
        userStore.logout();
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error(
        "Network error - Check if API server is running:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
