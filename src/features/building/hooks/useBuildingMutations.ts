import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "@/lib/api/building.api"
import type {
  CreateBuildingRequest,
  UpdateBuildingRequest,
} from "@/types/building"

/**
 * Building mutations hook
 *
 * Provides create, update, and delete mutations for buildings
 * with automatic query invalidation
 */
export function useBuildingMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateBuildingRequest) => createBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBuildingRequest }) =>
      updateBuilding(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBuilding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
