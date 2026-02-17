import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRoom, updateRoom, deleteRoom } from "@/lib/api/room.api"
import type { CreateRoomRequest, UpdateRoomRequest } from "@/types/room"

/**
 * Room mutations hook
 *
 * Provides create, update, and delete mutations for rooms
 * with automatic query invalidation
 */
export function useRoomMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateRoomRequest) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomRequest }) =>
      updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
