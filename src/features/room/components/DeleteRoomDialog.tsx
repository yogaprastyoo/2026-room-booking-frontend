"use client"

import { useQuery } from "@tanstack/react-query"
import { Room } from "@/types/room"
import { getBuildings } from "@/lib/api/building.api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRoomMutations } from "../hooks/useRoomMutations"

interface DeleteRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
}

export function DeleteRoomDialog({
  open,
  onOpenChange,
  room,
}: DeleteRoomDialogProps) {
  const { deleteMutation } = useRoomMutations()

  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getBuildings({ page: 1, pageSize: 100 }),
    enabled: open && !!room,
  })

  const getBuildingName = () => {
    if (!room) return ""
    const building = buildingsData?.items.find((b) => b.id === room.building_id)
    return building ? building.name : "Unknown Building"
  }

  const handleDelete = async () => {
    if (!room) return

    try {
      await deleteMutation.mutateAsync(room.id)
      onOpenChange(false)
    } catch {
      // Error is handled by mutation error state
    }
  }

  const isLoading = deleteMutation.isPending
  const isConflictError =
    deleteMutation.isError &&
    deleteMutation.error?.message?.toLowerCase().includes("conflict")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this room?
          </DialogDescription>
        </DialogHeader>

        {room && (
          <div className="rounded-md bg-muted p-3 space-y-1">
            <div className="text-sm">
              <span className="font-medium">Room Name:</span> {room.name}
            </div>
            <div className="text-sm">
              <span className="font-medium">Building:</span> {getBuildingName()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Capacity:</span>{" "}
              {room.capacity ?? "-"}
            </div>
          </div>
        )}

        {deleteMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {isConflictError ? (
              <>
                <div className="font-semibold">Cannot delete room</div>
                <div className="mt-1">
                  This room has active bookings. Please cancel or complete all
                  bookings first.
                </div>
              </>
            ) : (
              deleteMutation.error?.message || "Failed to delete room"
            )}
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
