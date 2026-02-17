"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Building } from "@/types/building"
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
import { useBuildingMutations } from "../hooks/useBuildingMutations"

interface BuildingFormData {
  name: string
  code: string
}

interface BuildingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  building?: Building
}

export function BuildingForm({
  open,
  onOpenChange,
  building,
}: BuildingFormProps) {
  const isEdit = !!building
  const { createMutation, updateMutation } = useBuildingMutations()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<BuildingFormData>({
    defaultValues: {
      name: building?.name || "",
      code: building?.code || "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: building?.name || "",
        code: building?.code || "",
      })
    }
  }, [open, building, reset])

  const onSubmit = async (data: BuildingFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: building.id, data })
      } else {
        await createMutation.mutateAsync(data)
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
            const fieldName = field.toLowerCase() as keyof BuildingFormData
            if (fieldName === "name" || fieldName === "code") {
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
          <DialogTitle>
            {isEdit ? "Update Building" : "Create Building"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the building information below."
              : "Enter the building information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 100,
                  message: "Name must not exceed 100 characters",
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
            <label htmlFor="code" className="text-sm font-medium">
              Code <span className="text-destructive">*</span>
            </label>
            <Input
              id="code"
              {...register("code", {
                required: "Code is required",
                maxLength: {
                  value: 20,
                  message: "Code must not exceed 20 characters",
                },
              })}
              aria-invalid={!!errors.code}
              disabled={isLoading}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
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
