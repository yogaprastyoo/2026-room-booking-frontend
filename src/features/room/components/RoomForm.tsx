"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { Room } from "@/types/room"
import { getBuildings } from "@/lib/api/building.api"
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
import { useRoomMutations } from "../hooks/useRoomMutations"
import { cn } from "@/lib/utils"

interface RoomFormData {
  building_id: string
  name: string
  capacity: string
}

interface RoomFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: Room
}

export function RoomForm({ open, onOpenChange, room }: RoomFormProps) {
  const isEdit = !!room
  const { createMutation, updateMutation } = useRoomMutations()

  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getBuildings({ page: 1, pageSize: 100 }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RoomFormData>({
    defaultValues: {
      building_id: room?.building_id || "",
      name: room?.name || "",
      capacity: room?.capacity?.toString() || "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        building_id: room?.building_id || "",
        name: room?.name || "",
        capacity: room?.capacity?.toString() || "",
      })
    }
  }, [open, room, reset])

  const onSubmit = async (data: RoomFormData) => {
    const payload = {
      building_id: data.building_id,
      name: data.name,
      capacity: parseInt(data.capacity, 10),
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: room.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
      reset()
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
            const fieldName = field.toLowerCase() as keyof RoomFormData
            if (
              fieldName === "building_id" ||
              fieldName === "name" ||
              fieldName === "capacity"
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Room" : "Create Room"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the room information below."
              : "Enter the room information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="building_id" className="text-sm font-medium">
              Building <span className="text-destructive">*</span>
            </label>
            <select
              id="building_id"
              {...register("building_id", {
                required: "Building is required",
              })}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.building_id && "border-destructive"
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
            {errors.building_id && (
              <p className="text-sm text-destructive">
                {errors.building_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Room Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              {...register("name", {
                required: "Room name is required",
                maxLength: {
                  value: 100,
                  message: "Room name must not exceed 100 characters",
                },
              })}
              aria-invalid={!!errors.name}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium">
              Capacity <span className="text-destructive">*</span>
            </label>
            <Input
              id="capacity"
              type="number"
              {...register("capacity", {
                required: "Capacity is required",
                min: {
                  value: 1,
                  message: "Capacity must be at least 1",
                },
              })}
              aria-invalid={!!errors.capacity}
              disabled={isLoading}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">
                {errors.capacity.message}
              </p>
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
              onClick={() => onOpenChange(false)}
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
