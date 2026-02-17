"use client"

import { useState } from "react"
import { Booking, BookingStatus } from "@/types/booking"
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

interface StatusUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: Booking | null
}

const STATUSES: BookingStatus[] = ["Pending", "Approved", "Rejected"]

export function StatusUpdateDialog({
  open,
  onOpenChange,
  booking,
}: StatusUpdateDialogProps) {
  const { updateStatusMutation } = useBookingMutations()
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null
  )

  const handleUpdateStatus = async () => {
    if (!booking || !selectedStatus) return

    try {
      await updateStatusMutation.mutateAsync({
        id: booking.id,
        data: { status: selectedStatus },
      })
      onOpenChange(false)
      setSelectedStatus(null)
    } catch {
      // Error is handled by mutation error state
    }
  }

  const isLoading = updateStatusMutation.isPending
  const isConflictError =
    updateStatusMutation.isError &&
    updateStatusMutation.error?.message?.toLowerCase().includes("conflict")

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setSelectedStatus(null)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Select a new status for this booking.
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <>
            <div className="rounded-md bg-muted p-3 space-y-1">
              <div className="text-sm">
                <span className="font-medium">Borrower:</span>{" "}
                {booking.borrower_name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Current Status:</span>{" "}
                {booking.status}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                New Status <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedStatus || ""}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as BookingStatus)
                }
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={isLoading}
              >
                <option value="">Select status</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {updateStatusMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {isConflictError ? (
              <>
                <div className="font-semibold">Cannot update status</div>
                <div className="mt-1">
                  {updateStatusMutation.error?.message ||
                    "A conflict occurred"}
                </div>
              </>
            ) : (
              updateStatusMutation.error?.message || "Failed to update status"
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setSelectedStatus(null)
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdateStatus}
            disabled={isLoading || !selectedStatus}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
