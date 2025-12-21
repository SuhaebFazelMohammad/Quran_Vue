/**
 * Type Courses API
 * All type course-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface TypeCourse {
  id: number;
  name: string;
  icon?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateTypeCourseData {
  name: string;
  icon?: File | null;
}

export interface UpdateTypeCourseData {
  name?: string;
  icon?: File | null;
}

/**
 * Get all type courses
 */
export async function getTypeCourses(params?: {
  page?: number;
  show?: number;
  search?: string;
}): Promise<PaginatedResponse<TypeCourse>> {
  interface BackendTypeCourseItem {
    id: number;
    name: string;
    icon?: string | null;
    [key: string]: any;
  }

  interface BackendTypeCoursesResponse {
    message?: string;
    data: {
      data: BackendTypeCourseItem[];
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

  const response = await apiClient.get<BackendTypeCoursesResponse>(
    "/admin/type-courses",
    {
      params,
    }
  );

  const body = response.data;
  const items = body.data?.data ?? [];
  const pagination = body.data?.pagination;

  const typeCourses: TypeCourse[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon ?? null,
  }));

  return {
    data: typeCourses,
    current_page: pagination?.current_page ?? params?.page ?? 1,
    last_page: pagination?.last_page ?? 1,
    per_page: pagination?.per_page ?? params?.show ?? typeCourses.length,
    total: pagination?.total ?? typeCourses.length,
  };
}

/**
 * Get single type course
 */
export async function getTypeCourse(id: number): Promise<TypeCourse> {
  interface BackendTypeCourseResponse {
    message?: string;
    data?: TypeCourse | any;
    code?: number;
    // Handle case where data is returned directly
    id?: number;
    name?: string;
    icon?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }

  const response = await apiClient.get<any>(`/admin/type-courses/${id}`);
  
  const body = response.data;
  
  // Debug: log the raw response
  console.log("Raw API response:", body);
  
  let courseData: any = null;
  
  // If data is nested under 'data' key
  if (body.data) {
    courseData = body.data;
  }
  // If response is an array (first element)
  else if (Array.isArray(body) && body.length > 0) {
    courseData = body[0];
  }
  // If data is returned directly as object
  else if (body.id !== undefined) {
    courseData = body;
  }
  // Fallback: use body directly
  else {
    courseData = body;
  }
  
  // Ensure we have valid data
  if (!courseData || (courseData.id === undefined && courseData.name === undefined)) {
    console.error("Invalid response structure:", body);
    throw new Error("Invalid response structure from server");
  }
  
  return {
    id: courseData.id ?? id,
    name: courseData.name ?? "",
    icon: courseData.icon ?? null,
    created_at: courseData.created_at ?? null,
    updated_at: courseData.updated_at ?? null,
  };
}

/**
 * Create type course
 */
export async function createTypeCourse(
  data: CreateTypeCourseData
): Promise<TypeCourse> {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.icon) {
    formData.append("icon", data.icon);
  }

  const response = await apiClient.post<{ data: TypeCourse }>(
    "/admin/type-courses",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
}

/**
 * Update type course
 */
export async function updateTypeCourse(
  id: number,
  data: UpdateTypeCourseData
): Promise<TypeCourse> {
  const formData = new FormData();
  
  // Always include name - it's required
  if (data.name !== undefined && data.name !== null) {
    formData.append("name", String(data.name));
  } else {
    throw new Error("Name is required for update");
  }
  
  // Only append icon if it's a File object (user selected a new icon)
  if (data.icon instanceof File) {
    formData.append("icon", data.icon);
  }

  // Debug: log FormData contents
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(key, ":", value.name, `(${value.size} bytes)`);
    } else {
      console.log(key, ":", value);
    }
  }

  // Laravel requires _method=PUT for PUT requests with FormData
  // Use POST with _method parameter instead of PUT
  formData.append("_method", "PUT");
  
  // For FormData, axios will automatically set Content-Type with boundary
  // The request interceptor will remove the default Content-Type header
  const response = await apiClient.post<{ data: TypeCourse }>(
    `/admin/type-courses/${id}`,
    formData
  );
  return response.data.data;
}

/**
 * Delete type course
 */
export async function deleteTypeCourse(id: number): Promise<void> {
  await apiClient.delete(`/admin/type-courses/${id}`);
}

