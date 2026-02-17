"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { getRooms } from "@/lib/api/room.api"
import { getBuildings } from "@/lib/api/building.api"
import { Room } from "@/types/room"
import { TableWrapper } from "@/components/shared/TableWrapper"
import { TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RoomForm } from "@/features/room/components/RoomForm"
import { DeleteRoomDialog } from "@/features/room/components/DeleteRoomDialog"
import { cn } from "@/lib/utils"

export default function RoomsPage() {
  const [page, setPage] = useState(1)
  const [buildingId, setBuildingId] = useState<string>("")
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getBuildings({ page: 1, pageSize: 100 }),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms", { page, buildingId }],
    queryFn: () => {
      // When filtering by building, fetch all rooms for client-side filtering
      if (buildingId) {
        return getRooms({
          page: 1,
          pageSize: 1000,
          buildingId: buildingId,
        })
      }
      // Without filter, use normal pagination
      return getRooms({
        page,
        pageSize: 10,
      })
    },
  })

  // Reset page when building filter changes
  useEffect(() => {
    setPage(1)
  }, [buildingId])

  const hasPrevious = page > 1 && !buildingId
  const hasNext = data ? (page < data.totalPages && !buildingId) : false

  // Helper to get building info for a room
  const getBuildingInfo = (buildingId: string) => {
    const building = buildingsData?.items.find((b) => b.id === buildingId)
    return building
      ? { name: building.name, code: building.code }
      : { name: "Unknown", code: "" }
  }

  const handleCreate = () => {
    setSelectedRoom(null)
    setFormOpen(true)
  }

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
    setFormOpen(true)
  }

  const handleDelete = (room: Room) => {
    setSelectedRoom(room)
    setDeleteOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedRoom(null)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setSelectedRoom(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Create Room
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="building-filter" className="text-sm font-medium">
            Filter by Building:
          </label>
          <select
            id="building-filter"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            className={cn(
              "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">All Buildings</option>
            {buildingsData?.items.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name} ({building.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <div className="font-semibold">Failed to load rooms</div>
          <div className="text-sm mt-1">
            {error instanceof Error ? error.message : "Please try again"}
          </div>
        </div>
      )}

      <TableWrapper
        columns={
          <>
            <TableHead>Room Name</TableHead>
            <TableHead>Building</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </>
        }
        isLoading={isLoading}
        emptyMessage="No rooms found"
      >
        {data?.items.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.name}</TableCell>
            <TableCell>
              {(() => {
                const building = getBuildingInfo(room.building_id)
                return `${building.name} (${building.code})`
              })()}
            </TableCell>
            <TableCell>{room.capacity ?? "-"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(room)}
                  title="Edit room"
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(room)}
                  title="Delete room"
                >
                  <Trash2Icon />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableWrapper>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages} ({data.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrevious}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <RoomForm
        open={formOpen}
        onOpenChange={handleFormClose}
        room={selectedRoom || undefined}
      />

      <DeleteRoomDialog
        open={deleteOpen}
        onOpenChange={handleDeleteClose}
        room={selectedRoom}
      />
    </div>
  )
}

