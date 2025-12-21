/**
 * Courses API
 * All course-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface Course {
  id: number;
  type_id: number;
  phone_num: string; // Parsed from JSON array, displayed as comma-separated
  address: string;
  name: string; // from typeCourse relationship
  description?: string; // only on show route
  date?: string; // only on show route
  user_id: {
    user: {
      id: number;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_num?: string;
      city?: string;
      role?: string;
      deleted_at?: string | null;
      [key: string]: any;
    };
  };
  [key: string]: any;
}

export interface CreateCourseData {
  type_id: number;
  phone_num: string;
  address: string;
  user_id: number;
  description?: string;
  date?: string;
}

export interface UpdateCourseData {
  type_id?: number;
  phone_num?: string;
  address?: string;
  user_id?: number;
  description?: string;
  date?: string;
}

interface BackendCourseItem {
  id: number;
  type_id: number;
  phone_num: string; // JSON string array
  address: string;
  name: string;
  user_id: {
    user: {
      id: number;
      attribute?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_num?: string;
        city?: string;
        role?: string;
        deleted_at?: string | null;
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
  [key: string]: any;
}

interface BackendCoursesResponse {
  message?: string;
  data: {
    data: BackendCourseItem[];
    type_course?: Array<{
      id: number;
      name: string;
    }>;
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

interface BackendShowCourseItem {
  id: number;
  type_id: number;
  phone_num: string; // JSON string array
  address: string;
  name: string;
  description?: string;
  date?: string;
  user_id: {
    user: {
      id: number;
      attribute?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_num?: string;
        city?: string;
        role?: string;
        deleted_at?: string | null;
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
  [key: string]: any;
}

interface BackendShowCourseResponse {
  message?: string;
  data: BackendShowCourseItem | { attribute: BackendShowCourseItem };
  code?: number;
}

/**
 * Get all courses with pagination
 */
export async function getCourses(params?: {
  page?: number;
  show?: number;
  search?: string;
  type_id?: number;
}): Promise<CoursesResponse> {
  const response = await apiClient.get<BackendCoursesResponse>("/admin/courses", {
    params,
  });

  const body = response.data;
  const items = body.data?.data ?? [];
  const pagination = body.data?.pagination;
  const typeCourse = body.data?.type_course ?? [];

  const courses: Course[] = items.map((item) => {
    // Parse phone_num if it's a JSON string array
    let phoneNum = item.phone_num;
    try {
      if (typeof phoneNum === 'string' && phoneNum.startsWith('[')) {
        const parsed = JSON.parse(phoneNum);
        phoneNum = Array.isArray(parsed) ? parsed.join(', ') : phoneNum;
      }
    } catch {
      // If parsing fails, use original value
    }

    // Extract user data from attribute if available
    const userData = item.user_id?.user;
    const userAttribute = userData?.attribute;
    
    return {
      id: item.id,
      type_id: item.type_id,
      phone_num: phoneNum,
      address: item.address,
      name: item.name,
      user_id: {
        user: {
          id: userData?.id || 0,
          first_name: userAttribute?.first_name,
          last_name: userAttribute?.last_name,
          email: userAttribute?.email,
          phone_num: userAttribute?.phone_num,
          city: userAttribute?.city,
          role: userAttribute?.role,
          deleted_at: userAttribute?.deleted_at,
        },
      },
    };
  });

  return {
    data: courses,
    total: pagination?.total || courses.length,
    per_page: pagination?.per_page || courses.length,
    current_page: pagination?.current_page || 1,
    last_page: pagination?.last_page || 1,
    type_course: typeCourse,
  };
}

/**
 * Get single course by ID
 */
export async function getCourse(id: number): Promise<Course> {
  const response = await apiClient.get<BackendShowCourseResponse>(`/admin/courses/${id}`);
  
  const body = response.data;
  const item = (body.data as any)?.attribute || body.data;
  
  // Parse phone_num if it's a JSON string array
  let phoneNum = item.phone_num;
  try {
    if (typeof phoneNum === 'string' && phoneNum.startsWith('[')) {
      const parsed = JSON.parse(phoneNum);
      phoneNum = Array.isArray(parsed) ? parsed.join(', ') : phoneNum;
    }
  } catch {
    // If parsing fails, use original value
  }

  // Extract user data from attribute if available
  const userData = item.user_id?.user;
  const userAttribute = userData?.attribute;
  
  return {
    id: item.id,
    type_id: item.type_id,
    phone_num: phoneNum,
    address: item.address,
    name: item.name,
    description: item.description,
    date: item.date,
    user_id: {
      user: {
        id: userData?.id || 0,
        first_name: userAttribute?.first_name,
        last_name: userAttribute?.last_name,
        email: userAttribute?.email,
        phone_num: userAttribute?.phone_num,
        city: userAttribute?.city,
        role: userAttribute?.role,
        deleted_at: userAttribute?.deleted_at,
      },
    },
  };
}

/**
 * Create new course
 */
export async function createCourse(data: CreateCourseData): Promise<Course> {
  const response = await apiClient.post<{ data: Course }>("/admin/courses", data);
  return response.data.data;
}

/**
 * Update course
 */
export async function updateCourse(
  id: number,
  data: UpdateCourseData
): Promise<Course> {
  const response = await apiClient.put<{ data: Course }>(
    `/admin/courses/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Delete course
 */
export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(`/admin/courses/${id}`);
}
