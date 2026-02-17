/**
 * Room Type Definitions
 * 
 * Aligned with backend API contract from docs/v1.json
 */

/**
 * Room entity
 */
export interface Room {
  id: string;
  building_id: string;
  name: string;
  capacity: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Room with building information
 */
export interface RoomWithBuilding extends Room {
  building_name: string;
  building_code: string;
}

/**
 * Request payload for creating a room
 */
export interface CreateRoomRequest {
  building_id: string;
  name: string;
  capacity: number;
}

/**
 * Request payload for updating a room
 */
export interface UpdateRoomRequest {
  building_id: string;
  name: string;
  capacity: number;
}

/**
 * Query parameters for listing rooms
 */
export interface GetRoomsParams {
  page?: number;
  pageSize?: number;
  buildingId?: string;
}

/**
 * Paginated response for rooms list
 */
export interface RoomsListResponse {
  items: Room[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
