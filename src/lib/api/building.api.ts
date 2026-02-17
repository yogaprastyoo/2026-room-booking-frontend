import { apiClient } from "./client";
import type {
  Building,
  CreateBuildingRequest,
  UpdateBuildingRequest,
  GetBuildingsParams,
  BuildingsListResponse,
} from "@/types/building";

/**
 * Building API
 * 
 * Endpoints verified against docs/v1.json
 * All responses are unwrapped by the apiClient interceptor
 */

/**
 * Get paginated list of buildings
 * 
 * @param params - Pagination parameters (page, pageSize)
 * @returns Paginated list of buildings
 * 
 * Endpoint: GET /api/buildings
 */
export async function getBuildings(
  params?: GetBuildingsParams
): Promise<BuildingsListResponse> {
  const response = await apiClient.get<BuildingsListResponse>("/buildings", {
    params,
  });
  return response.data;
}

/**
 * Get a single building by ID
 * 
 * @param id - Building UUID
 * @returns Building details
 * 
 * Endpoint: GET /api/buildings/{id}
 */
export async function getBuildingById(id: string): Promise<Building> {
  const response = await apiClient.get<Building>(`/buildings/${id}`);
  return response.data;
}

/**
 * Create a new building
 * 
 * @param data - Building creation payload
 * @returns Created building
 * 
 * Endpoint: POST /api/buildings
 */
export async function createBuilding(
  data: CreateBuildingRequest
): Promise<Building> {
  const response = await apiClient.post<Building>("/buildings", data);
  return response.data;
}

/**
 * Update an existing building
 * 
 * @param id - Building UUID
 * @param data - Building update payload
 * @returns Updated building
 * 
 * Endpoint: PUT /api/buildings/{id}
 */
export async function updateBuilding(
  id: string,
  data: UpdateBuildingRequest
): Promise<Building> {
  const response = await apiClient.put<Building>(`/buildings/${id}`, data);
  return response.data;
}

/**
 * Delete a building
 * 
 * @param id - Building UUID
 * 
 * Endpoint: DELETE /api/buildings/{id}
 * 
 * Note: Backend will return conflict if building has associated rooms
 */
export async function deleteBuilding(id: string): Promise<void> {
  await apiClient.delete(`/buildings/${id}`);
}
