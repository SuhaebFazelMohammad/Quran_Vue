/**
 * API Configuration
 * Centralized configuration for API base URL
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// API version prefix (if needed)
export const API_VERSION = import.meta.env.VITE_API_VERSION || "";

// Full API URL
export const API_URL = `${API_BASE_URL}${API_VERSION ? `/${API_VERSION}` : ""}`;

// Request timeout in milliseconds
export const API_TIMEOUT = 30000; // 30 seconds

// Log API URL in development (for debugging)
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL);
  console.log("Full API URL:", API_URL);
}
