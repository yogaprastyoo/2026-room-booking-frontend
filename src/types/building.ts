/**
 * Building Type Definitions
 * 
 * Aligned with backend API contract from docs/v1.json
 */

/**
 * Building entity
 */
export interface Building {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for creating a building
 */
export interface CreateBuildingRequest {
  name: string;
  code: string;
}

/**
 * Request payload for updating a building
 */
export interface UpdateBuildingRequest {
  name: string;
  code: string;
}

/**
 * Query parameters for listing buildings
 */
export interface GetBuildingsParams {
  page?: number;
  pageSize?: number;
}

/**
 * Paginated response for buildings list
 */
export interface BuildingsListResponse {
  items: Building[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
