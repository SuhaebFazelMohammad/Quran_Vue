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

/**
 * Notification interface
 */
export interface Notification {
  id: string | number;
  type: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
  [key: string]: any;
}

/**
 * User with notifications response
 */
export interface UserWithNotificationsResponse {
  user: LoginResponse["user"];
  notifications: {
    not_read: Notification[];
    read: Notification[];
    all: Notification[];
  };
}

/**
 * Get notifications
 * Backend route: GET /notifications
 * Returns: { user: {...}, notifications: { not_read: [], read: [], all: [] } }
 */
export async function getNotifications(): Promise<UserWithNotificationsResponse> {
  const response = await apiClient.get<any>("/notifications");
  const data = response.data;

  // Handle response structure: { user: {...}, notifications: {...} }
  return {
    user: data.user || data.data?.user || data,
    notifications: data.notifications || {
      not_read: [],
      read: [],
      all: [],
    },
  };
}

/**
 * Get current authenticated user with notifications
 * Backend route: GET /notifications (uses dedicated notifications endpoint)
 * Returns: { user: {...}, notifications: { not_read: [], read: [], all: [] } }
 * @deprecated Use getNotifications() instead. Kept for backward compatibility.
 */
export async function getUserWithNotifications(): Promise<UserWithNotificationsResponse> {
  return getNotifications();
}

/**
 * Mark notification as read
 * Backend route: POST /notifications/{id}/read
 */
export async function markNotificationAsRead(
  notificationId: string | number
): Promise<void> {
  await apiClient.post(`/notifications/${notificationId}/read`);
}

/**
 * Mark all notifications as read
 * Backend route: POST /notifications/read-all
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}