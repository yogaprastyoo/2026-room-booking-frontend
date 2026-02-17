import { apiClient } from "./client";
import type {
  Room,
  CreateRoomRequest,
  UpdateRoomRequest,
  GetRoomsParams,
  RoomsListResponse,
} from "@/types/room";

/**
 * Room API
 * 
 * Endpoints verified against docs/v1.json
 * All responses are unwrapped by the apiClient interceptor
 */

/**
 * Get paginated list of rooms
 * 
 * @param params - Pagination and filter parameters (page, pageSize, buildingId)
 * @returns Paginated list of rooms with building information
 * 
 * Endpoint: GET /api/rooms
 */
export async function getRooms(
  params?: GetRoomsParams
): Promise<RoomsListResponse> {
  const response = await apiClient.get<RoomsListResponse>("/rooms", {
    params: params
      ? {
          page: params.page,
          pageSize: params.pageSize,
          buildingId: params.buildingId,
        }
      : undefined,
  });
  return response.data;
}

/**
 * Get a single room by ID
 * 
 * @param id - Room UUID
 * @returns Room details
 * 
 * Endpoint: GET /api/rooms/{id}
 */
export async function getRoomById(id: string): Promise<Room> {
  const response = await apiClient.get<Room>(`/rooms/${id}`);
  return response.data;
}

/**
 * Create a new room
 * 
 * @param data - Room creation payload
 * @returns Created room
 * 
 * Endpoint: POST /api/rooms
 */
export async function createRoom(data: CreateRoomRequest): Promise<Room> {
  const response = await apiClient.post<Room>("/rooms", data);
  return response.data;
}

/**
 * Update an existing room
 * 
 * @param id - Room UUID
 * @param data - Room update payload
 * @returns Updated room
 * 
 * Endpoint: PUT /api/rooms/{id}
 */
export async function updateRoom(
  id: string,
  data: UpdateRoomRequest
): Promise<Room> {
  const response = await apiClient.put<Room>(`/rooms/${id}`, data);
  return response.data;
}

/**
 * Delete a room
 * 
 * @param id - Room UUID
 * 
 * Endpoint: DELETE /api/rooms/{id}
 * 
 * Note: Backend will return conflict if room has active bookings
 */
export async function deleteRoom(id: string): Promise<void> {
  await apiClient.delete(`/rooms/${id}`);
}
