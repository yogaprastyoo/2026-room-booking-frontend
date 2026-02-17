"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { Booking } from "@/types/booking"
import { getBuildings } from "@/lib/api/building.api"
import { getRooms } from "@/lib/api/room.api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBookingMutations } from "../hooks/useBookingMutations"
import { cn } from "@/lib/utils"

// Helper to convert UTC datetime to Asia/Jakarta local datetime for input
function toJakartaDateTimeLocal(utcDateString: string): string {
  const date = new Date(utcDateString)
  // Convert to Asia/Jakarta timezone
  const jakartaTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  // Format to YYYY-MM-DDTHH:mm for datetime-local input
  const year = jakartaTime.getFullYear()
  const month = String(jakartaTime.getMonth() + 1).padStart(2, '0')
  const day = String(jakartaTime.getDate()).padStart(2, '0')
  const hours = String(jakartaTime.getHours()).padStart(2, '0')
  const minutes = String(jakartaTime.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Helper to convert datetime-local input (treated as Jakarta time) to UTC ISO string
function jakartaDateTimeLocalToUTC(localDateTimeString: string): string {
  // Parse the local datetime string as Jakarta time
  const [datePart, timePart] = localDateTimeString.split('T')
  const [year, month, day] = datePart.split('-')
  const [hours, minutes] = timePart.split(':')
  
  // Create date string in ISO format with Jakarta timezone offset (+07:00)
  const jakartaISOString = `${year}-${month}-${day}T${hours}:${minutes}:00+07:00`
  
  // Convert to UTC
  return new Date(jakartaISOString).toISOString()
}

interface BookingFormData {
  room_id: string
  borrower_name: string
  booking_start: string
  booking_end: string
  notes: string
}

interface BookingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking?: Booking
}

export function BookingForm({ open, onOpenChange, booking }: BookingFormProps) {
  const isEdit = !!booking
  const { createMutation, updateMutation } = useBookingMutations()
  const [selectedBuildingId, setSelectedBuildingId] = useState("")

  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getBuildings({ page: 1, pageSize: 100 }),
    enabled: open,
  })

  const { data: roomsData } = useQuery({
    queryKey: ["rooms", { buildingId: selectedBuildingId }],
    queryFn: () =>
      getRooms({
        page: 1,
        pageSize: 1000, // Fetch all rooms for client-side filtering
        buildingId: selectedBuildingId || undefined,
      }),
    enabled: open && !!selectedBuildingId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm<BookingFormData>({
    defaultValues: {
      room_id: booking?.room_id || "",
      borrower_name: booking?.borrower_name || "",
      booking_start: booking?.booking_start
        ? toJakartaDateTimeLocal(booking.booking_start)
        : "",
      booking_end: booking?.booking_end
        ? toJakartaDateTimeLocal(booking.booking_end)
        : "",
      notes: booking?.notes || "",
    },
  })

  const roomId = watch("room_id")

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        room_id: booking?.room_id || "",
        borrower_name: booking?.borrower_name || "",
        booking_start: booking?.booking_start
          ? toJakartaDateTimeLocal(booking.booking_start)
          : "",
        booking_end: booking?.booking_end
          ? toJakartaDateTimeLocal(booking.booking_end)
          : "",
        notes: booking?.notes || "",
      })
      setSelectedBuildingId("")
    } else {
      setSelectedBuildingId("")
    }
  }, [open, booking, reset])

  // Clear room selection when building changes (create mode only)
  useEffect(() => {
    if (!isEdit && selectedBuildingId) {
      reset((formValues) => ({ ...formValues, room_id: "" }))
    }
  }, [selectedBuildingId, isEdit, reset])

  const onSubmit = async (data: BookingFormData) => {
    // Convert Jakarta time input to UTC for comparison and submission
    const bookingStartUTC = jakartaDateTimeLocalToUTC(data.booking_start)
    const bookingEndUTC = jakartaDateTimeLocalToUTC(data.booking_end)
    const bookingStart = new Date(bookingStartUTC)
    const bookingEnd = new Date(bookingEndUTC)
    const now = new Date()

    // Validate dates
    if (bookingEnd <= bookingStart) {
      setError("booking_end", {
        type: "manual",
        message: "End time must be after start time",
      })
      return
    }

    if (!isEdit && bookingStart < now) {
      setError("booking_start", {
        type: "manual",
        message: "Start time cannot be in the past",
      })
      return
    }

    const payload = {
      room_id: data.room_id,
      borrower_name: data.borrower_name,
      booking_start: bookingStartUTC,
      booking_end: bookingEndUTC,
      notes: data.notes || null,
    }

    try {
      if (isEdit) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { room_id, ...updateData } = payload
        await updateMutation.mutateAsync({ id: booking.id, data: updateData })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
      reset()
      setSelectedBuildingId("")
    } catch (error) {
      // Handle validation errors from backend
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        error.errors &&
        typeof error.errors === "object"
      ) {
        Object.entries(error.errors as Record<string, string[]>).forEach(
          ([field, messages]) => {
            const fieldName = field.toLowerCase() as keyof BookingFormData
            if (
              fieldName === "room_id" ||
              fieldName === "borrower_name" ||
              fieldName === "booking_start" ||
              fieldName === "booking_end" ||
              fieldName === "notes"
            ) {
              setError(fieldName, {
                type: "manual",
                message: (messages as string[])[0],
              })
            }
          }
        )
      }
    }
  }

  const mutation = isEdit ? updateMutation : createMutation
  const isLoading = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Booking" : "Create Booking"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the booking information below."
              : "Enter the booking information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isEdit && (
            <>
              <div className="space-y-2">
                <label htmlFor="building" className="text-sm font-medium">
                  Building <span className="text-destructive">*</span>
                </label>
                <select
                  id="building"
                  value={selectedBuildingId}
                  onChange={(e) => setSelectedBuildingId(e.target.value)}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  disabled={isLoading}
                >
                  <option value="">Select a building</option>
                  {buildingsData?.items.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name} ({building.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="room_id" className="text-sm font-medium">
                  Room <span className="text-destructive">*</span>
                </label>
                <select
                  id="room_id"
                  {...register("room_id", {
                    required: "Room is required",
                  })}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.room_id && "border-destructive"
                  )}
                  disabled={isLoading || !selectedBuildingId}
                >
                  <option value="">Select a room</option>
                  {roomsData?.items.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity ?? "N/A"})
                    </option>
                  ))}
                </select>
                {errors.room_id && (
                  <p className="text-sm text-destructive">
                    {errors.room_id.message}
                  </p>
                )}
              </div>
            </>
          )}

          {isEdit && booking && (
            <div className="rounded-md bg-muted p-3">
              <div className="text-sm">
                <span className="font-medium">Room:</span> {roomId}
                <div className="text-xs text-muted-foreground mt-1">
                  Room cannot be changed when updating a booking
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="borrower_name" className="text-sm font-medium">
              Borrower Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="borrower_name"
              {...register("borrower_name", {
                required: "Borrower name is required",
                maxLength: {
                  value: 100,
                  message: "Borrower name must not exceed 100 characters",
                },
              })}
              aria-invalid={!!errors.borrower_name}
              disabled={isLoading}
            />
            {errors.borrower_name && (
              <p className="text-sm text-destructive">
                {errors.borrower_name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="booking_start" className="text-sm font-medium">
                Start Time <span className="text-destructive">*</span>
              </label>
              <Input
                id="booking_start"
                type="datetime-local"
                {...register("booking_start", {
                  required: "Start time is required",
                })}
                aria-invalid={!!errors.booking_start}
                disabled={isLoading}
              />
              {errors.booking_start && (
                <p className="text-sm text-destructive">
                  {errors.booking_start.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="booking_end" className="text-sm font-medium">
                End Time <span className="text-destructive">*</span>
              </label>
              <Input
                id="booking_end"
                type="datetime-local"
                {...register("booking_end", {
                  required: "End time is required",
                })}
                aria-invalid={!!errors.booking_end}
                disabled={isLoading}
              />
              {errors.booking_end && (
                <p className="text-sm text-destructive">
                  {errors.booking_end.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              {...register("notes", {
                maxLength: {
                  value: 500,
                  message: "Notes must not exceed 500 characters",
                },
              })}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.notes && "border-destructive"
              )}
              disabled={isLoading}
              placeholder="Optional notes"
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {mutation.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error?.message || "An error occurred"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setSelectedBuildingId("")
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
