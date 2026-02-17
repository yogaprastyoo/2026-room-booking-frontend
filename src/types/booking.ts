/**
 * Booking Type Definitions
 * 
 * Aligned with backend API contract from docs/v1.json
 */

/**
 * Booking status enum
 */
export type BookingStatus = "Pending" | "Approved" | "Rejected";

/**
 * Booking entity
 */
export interface Booking {
  id: string;
  room_id: string;
  borrower_name: string;
  booking_start: string;
  booking_end: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Booking with related information
 */
export interface BookingWithDetails extends Booking {
  room_name: string;
  building_id: string;
  building_name: string;
  building_code: string;
}

/**
 * Request payload for creating a booking
 */
export interface CreateBookingRequest {
  room_id: string;
  borrower_name: string;
  booking_start: string;
  booking_end: string;
  notes?: string | null;
}

/**
 * Request payload for updating a booking
 */
export interface UpdateBookingRequest {
  borrower_name: string;
  booking_start: string;
  booking_end: string;
  notes?: string | null;
}

/**
 * Request payload for updating booking status
 */
export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

/**
 * Query parameters for listing bookings
 */
export interface GetBookingsParams {
  page?: number;
  pageSize?: number;
  BuildingId?: string;
  RoomId?: string;
  Status?: string;
  BorrowerName?: string;
  StartDate?: string;
  EndDate?: string;
  SortBy?: string;
  SortOrder?: string;
}

/**
 * Paginated response for bookings list
 */
export interface BookingsListResponse {
  items: Booking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
