/**
 * Users API
 * All user-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
}

/**
 * Get all users with pagination
 */
export async function getUsers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>("/users", {
    params,
  });
  return response.data;
}

/**
 * Get single user by ID
 */
export async function getUser(id: number): Promise<User> {
  const response = await apiClient.get<{ data: User }>(`/users/${id}`);
  return response.data.data;
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiClient.post<{ data: User }>("/users", data);
  return response.data.data;
}

/**
 * Update user
 */
export async function updateUser(id: number, data: UpdateUserData): Promise<User> {
  const response = await apiClient.put<{ data: User }>(`/users/${id}`, data);
  return response.data.data;
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

