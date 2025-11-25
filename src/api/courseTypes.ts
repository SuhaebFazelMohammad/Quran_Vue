/**
 * Course Types API
 * All course type-related API calls
 */

import apiClient from "./client";
import type { PaginatedResponse } from "./types";

export interface CourseType {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface CreateCourseTypeData {
  name: string;
  description?: string;
}

export interface UpdateCourseTypeData {
  name?: string;
  description?: string;
}

/**
 * Get all course types with pagination
 */
export async function getCourseTypes(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<CourseType>> {
  const response = await apiClient.get<PaginatedResponse<CourseType>>("/course-types", {
    params,
  });
  return response.data;
}

/**
 * Get single course type by ID
 */
export async function getCourseType(id: number): Promise<CourseType> {
  const response = await apiClient.get<{ data: CourseType }>(`/course-types/${id}`);
  return response.data.data;
}

/**
 * Create new course type
 */
export async function createCourseType(data: CreateCourseTypeData): Promise<CourseType> {
  const response = await apiClient.post<{ data: CourseType }>("/course-types", data);
  return response.data.data;
}

/**
 * Update course type
 */
export async function updateCourseType(
  id: number,
  data: UpdateCourseTypeData
): Promise<CourseType> {
  const response = await apiClient.put<{ data: CourseType }>(`/course-types/${id}`, data);
  return response.data.data;
}

/**
 * Delete course type
 */
export async function deleteCourseType(id: number): Promise<void> {
  await apiClient.delete(`/course-types/${id}`);
}

