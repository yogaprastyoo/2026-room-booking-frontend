import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "@/lib/api/booking.api"
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
} from "@/types/booking"

/**
 * Booking mutations hook
 *
 * Provides create, update, delete, and status update mutations for bookings
 * with automatic query invalidation
 */
export function useBookingMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) =>
      updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateBookingStatusRequest
    }) => updateBookingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
  }
}
