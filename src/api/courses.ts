/**
 * Courses API
 * All course-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface Course {
  id: number;
  title: string;
  description?: string;
  course_type_id?: number;
  [key: string]: any;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  course_type_id?: number;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  course_type_id?: number;
}

/**
 * Get all courses with pagination
 */
export async function getCourses(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  course_type_id?: number;
}): Promise<PaginatedResponse<Course>> {
  const response = await apiClient.get<PaginatedResponse<Course>>("/courses", {
    params,
  });
  return response.data;
}

/**
 * Get single course by ID
 */
export async function getCourse(id: number): Promise<Course> {
  const response = await apiClient.get<{ data: Course }>(`/courses/${id}`);
  return response.data.data;
}

/**
 * Create new course
 */
export async function createCourse(data: CreateCourseData): Promise<Course> {
  const response = await apiClient.post<{ data: Course }>("/courses", data);
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
    `/courses/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Delete course
 */
export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(`/courses/${id}`);
}
