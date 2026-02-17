"use client"

import { Booking } from "@/types/booking"
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

interface DeleteBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: Booking | null
}

export function DeleteBookingDialog({
  open,
  onOpenChange,
  booking,
}: DeleteBookingDialogProps) {
  const { deleteMutation } = useBookingMutations()

  const handleDelete = async () => {
    if (!booking) return

    try {
      await deleteMutation.mutateAsync(booking.id)
      onOpenChange(false)
    } catch {
      // Error is handled by mutation error state
    }
  }

  const isLoading = deleteMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking?
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <div className="rounded-md bg-muted p-3 space-y-1">
            <div className="text-sm">
              <span className="font-medium">Borrower:</span>{" "}
              {booking.borrower_name}
            </div>
            <div className="text-sm">
              <span className="font-medium">Start:</span>{" "}
              {new Date(booking.booking_start).toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">End:</span>{" "}
              {new Date(booking.booking_end).toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Status:</span> {booking.status}
            </div>
          </div>
        )}

        {deleteMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {deleteMutation.error?.message || "Failed to delete booking"}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
