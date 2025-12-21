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
  // Most Laravel APIs expose the currently authenticated user at GET /user
  // We handle multiple common response shapes:
  // - { data: { ...user } }
  // - { user: { ...user } }
  // - { ...user }
  const response = await apiClient.get<any>("/user");
  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  if (data?.user) {
    return data.user;
  }

  return data as LoginResponse["user"];
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<{ token: string }> {
  const response = await apiClient.post<{ token: string }>("/refresh");
  return response.data;
}
