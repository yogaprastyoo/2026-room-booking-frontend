"use client"

import { Building } from "@/types/building"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBuildingMutations } from "../hooks/useBuildingMutations"

interface DeleteBuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  building: Building | null
}

export function DeleteBuildingDialog({
  open,
  onOpenChange,
  building,
}: DeleteBuildingDialogProps) {
  const { deleteMutation } = useBuildingMutations()

  const handleDelete = async () => {
    if (!building) return

    try {
      await deleteMutation.mutateAsync(building.id)
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
          <DialogTitle>Delete Building</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this building?
          </DialogDescription>
        </DialogHeader>

        {building && (
          <div className="rounded-md bg-muted p-3 space-y-1">
            <div className="text-sm">
              <span className="font-medium">Name:</span> {building.name}
            </div>
            <div className="text-sm">
              <span className="font-medium">Code:</span> {building.code}
            </div>
          </div>
        )}

        {deleteMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {isConflictError ? (
              <>
                <div className="font-semibold">Cannot delete building</div>
                <div className="mt-1">
                  This building has associated rooms. Please delete all rooms
                  first.
                </div>
              </>
            ) : (
              deleteMutation.error?.message || "Failed to delete building"
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
