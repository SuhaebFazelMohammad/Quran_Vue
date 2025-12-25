/**
 * Users API
 * All user-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  phone_num?: string;
  gender?: string;
  email: string;
  password?: string;
  // Prefer backend's date_of_birth; keep birthday for backward compatibility
  date_of_birth?: string | null;
  birthday?: string | null;
  role?: string;
  city?: string;
  address?: string;
  // Backend column: listening_from (keep listen_from for backward compatibility)
  listening_from?: string;
  listen_from?: string;
  image?: number | string | null;
  sitting_id?: number | null;
  softDelete?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_num?: string;
  gender?: string;
  date_of_birth?: string;
  role?: string;
  city?: string;
  address?: string;
  listening_from?: string;
  image?: number | string | File;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone_num?: string;
  gender?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  date_of_birth?: string | null;
  role?: string;
  city?: string;
  address?: string;
  listening_from?: string;
  image?: number | string | null;
  deleted_at?: string | null; // null to restore, ISO string to soft delete
}

/**
 * Get all users with pagination and filters
 *
 * Backend (Laravel) example:
 *
 * $filters = $request->only('role', 'city');
 * $search  = $request->input('search');
 * $show    = $request->input('show') ?? 10;
 */
export async function getUsers(params?: {
  page?: number;
  show?: number; // page size
  search?: string;
  role?: string | number;
  gender?: string | number; // "1" for Male, "2" for Female
  city?: string;
  deleted_at?: string; // "active" or "deleted" for soft delete filter
}): Promise<PaginatedResponse<User>> {
  interface BackendUserItem {
    id: number;
    attribute: {
      first_name?: string;
      last_name?: string;
      phone_num?: string;
      email: string;
      city?: string;
      [key: string]: any;
    };
  }

  interface BackendUsersResponse {
    message?: string;
    data: {
      data: BackendUserItem[];
      pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
      };
    };
    code?: number;
  }

  const response = await apiClient.get<BackendUsersResponse>("/admin/users", {
    params,
  });

  const body = response.data;
  const items = body.data?.data ?? [];
  const pagination = body.data?.pagination;

  const users: User[] = items.map((item) => ({
    id: item.id,
    ...item.attribute,
  }));

  return {
    data: users,
    current_page: pagination?.current_page ?? params?.page ?? 1,
    last_page: pagination?.last_page ?? 1,
    per_page: pagination?.per_page ?? params?.show ?? users.length,
    total: pagination?.total ?? users.length,
  };
}

/**
 * Get single user by ID
 */
export async function getUser(id: number): Promise<User> {
  // Backend "show" route returns:
  // {
  //   "message": "User fetched successfully",
  //   "data": {
  //     "id": 1,
  //     "attribute": { ...user fields... }
  //   },
  //   "code": 200
  // }
  interface BackendShowItem {
    id: number;
    created_at?: string | null;
    updated_at?: string | null;
    attribute: {
      first_name?: string;
      last_name?: string;
      phone_num?: string;
      email: string;
      city?: string;
      role?: string | number;
      gender?: string | number;
      address?: string;
      date_of_birth?: string | null;
      listening_from?: string | null;
      image?: number | string | null;
      sitting_id?: number | null;
      deleted_at?: string | null;
      [key: string]: any;
    };
  }

  interface BackendShowResponse {
    message?: string;
    data: BackendShowItem;
    code?: number;
  }

  const response = await apiClient.get<BackendShowResponse>(
    `/admin/users/${id}`
  );
  const body = response.data;
  const item = body.data;

  const attr = item.attribute;

  const user: User = {
    id: item.id,
    // Normalize / map backend attribute fields into our User shape
    first_name: attr.first_name,
    last_name: attr.last_name,
    phone_num: attr.phone_num,
    email: attr.email,
    city: attr.city,
    address: attr.address,
    date_of_birth: attr.date_of_birth ?? undefined,
    listening_from: attr.listening_from ?? undefined,
    image: attr.image ?? undefined,
    sitting_id: attr.sitting_id ?? undefined,
    softDelete: attr.deleted_at ?? null,
    created_at: attr.created_at ?? item.created_at ?? null,
    updated_at: attr.updated_at ?? item.updated_at ?? null,
    // Normalize fields that can be numeric in backend into strings
    gender: attr.gender != null ? String(attr.gender) : undefined,
    role: attr.role != null ? String(attr.role) : undefined,
  };

  return user;
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserData | FormData): Promise<User> {
  // If data is FormData, send it directly (for file uploads)
  // The request interceptor will handle Content-Type header automatically
  // Otherwise, send as JSON
  const response = await apiClient.post<{ data: User }>("/admin/users", data);
  return response.data.data;
}

/**
 * Update user
 */
export async function updateUser(
  id: number,
  data: UpdateUserData | FormData
): Promise<User> {
  // If data is FormData, use POST with _method=PUT for Laravel compatibility
  // Otherwise, use PUT for JSON data
  if (data instanceof FormData) {
    data.append("_method", "PUT");
    const response = await apiClient.post<{ data: User }>(
      `/admin/users/${id}`,
      data
    );
    return response.data.data;
  } else {
    const response = await apiClient.put<{ data: User }>(
      `/admin/users/${id}`,
      data
    );
    return response.data.data;
  }
}

/**
 * Update currently authenticated user's profile
 * Backend route: POST /profile/update
 *
 * Supports common Laravel response shapes:
 * - { data: { ...user } }
 * - { user: { ...user } }
 * - { ...user }
 */
export async function updateProfile(data: UpdateUserData): Promise<User> {
  const response = await apiClient.post<any>("/profile/update", data);
  const body = response.data;

  if (body?.data) {
    return body.data as User;
  }

  if (body?.user) {
    return body.user as User;
  }

  return body as User;
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}
