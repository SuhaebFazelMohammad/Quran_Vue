/**
 * Authentication API
 * All authentication-related API calls
 */

import apiClient from "./client";

export interface LoginCredentials {
  login: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
  };
  token: string;
}

/**
 * Login user
 * Handles different Laravel response formats:
 * - { user: {...}, token: "..." }
 * - { user: {...}, access_token: "..." }
 * - { data: { user: {...}, token: "..." } }
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiClient.post<any>("/login", credentials);
  const data = response.data;

  // Handle different Laravel response formats
  if (data.data) {
    // Response wrapped in data: { data: { user, token } }
    return {
      user: data.data.user || data.data,
      token: data.data.token || data.data.access_token,
    };
  } else {
    // Direct response: { user, token } or { user, access_token }
    return {
      user: data.user,
      token: data.token || data.access_token,
    };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await apiClient.post("/logout");
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<LoginResponse["user"]> {
  const response = await apiClient.get<{ data: LoginResponse["user"] }>(
    "/user"
  );
  return response.data.data;
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<{ token: string }> {
  const response = await apiClient.post<{ token: string }>("/refresh");
  return response.data;
}
