import { apiClient } from "./client";
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
  GetBookingsParams,
  BookingsListResponse,
} from "@/types/booking";

/**
 * Booking API
 * 
 * Endpoints verified against docs/v1.json
 * All responses are unwrapped by the apiClient interceptor
 */

/**
 * Get paginated list of bookings
 * 
 * @param params - Pagination and filter parameters
 * @returns Paginated list of bookings
 * 
 * Endpoint: GET /api/bookings
 */
export async function getBookings(
  params?: GetBookingsParams
): Promise<BookingsListResponse> {
  const response = await apiClient.get<BookingsListResponse>("/bookings", {
    params,
  });
  return response.data;
}

/**
 * Get a single booking by ID
 * 
 * @param id - Booking UUID
 * @returns Booking details
 * 
 * Endpoint: GET /api/bookings/{id}
 */
export async function getBookingById(id: string): Promise<Booking> {
  const response = await apiClient.get<Booking>(`/bookings/${id}`);
  return response.data;
}

/**
 * Create a new booking
 * 
 * @param data - Booking creation payload
 * @returns Created booking
 * 
 * Endpoint: POST /api/bookings
 */
export async function createBooking(
  data: CreateBookingRequest
): Promise<Booking> {
  const response = await apiClient.post<Booking>("/bookings", data);
  return response.data;
}

/**
 * Update an existing booking
 * 
 * @param id - Booking UUID
 * @param data - Booking update payload
 * @returns Updated booking
 * 
 * Endpoint: PUT /api/bookings/{id}
 * 
 * Note: room_id is not editable via update
 */
export async function updateBooking(
  id: string,
  data: UpdateBookingRequest
): Promise<Booking> {
  const response = await apiClient.put<Booking>(`/bookings/${id}`, data);
  return response.data;
}

/**
 * Update booking status
 * 
 * @param id - Booking UUID
 * @param data - Status update payload
 * @returns Updated booking
 * 
 * Endpoint: PATCH /api/bookings/{id}/status
 */
export async function updateBookingStatus(
  id: string,
  data: UpdateBookingStatusRequest
): Promise<Booking> {
  const response = await apiClient.patch<Booking>(
    `/bookings/${id}/status`,
    data
  );
  return response.data;
}

/**
 * Delete a booking (soft delete)
 * 
 * @param id - Booking UUID
 * 
 * Endpoint: DELETE /api/bookings/{id}
 * 
 * Note: Backend performs soft delete - record will not appear in GET results
 */
export async function deleteBooking(id: string): Promise<void> {
  await apiClient.delete(`/bookings/${id}`);
}
