/**
 * Shared API Types
 * Common types used across multiple API modules
 */

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
