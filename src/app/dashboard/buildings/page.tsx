"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { getBuildings } from "@/lib/api/building.api"
import { Building } from "@/types/building"
import { TableWrapper } from "@/components/shared/TableWrapper"
import { TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BuildingForm } from "@/features/building/components/BuildingForm"
import { DeleteBuildingDialog } from "@/features/building/components/DeleteBuildingDialog"

export default function BuildingsPage() {
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ["buildings", page],
    queryFn: () => getBuildings({ page, pageSize: 10 }),
  })

  const hasPrevious = page > 1
  const hasNext = data ? page < data.totalPages : false

  const handleCreate = () => {
    setSelectedBuilding(null)
    setFormOpen(true)
  }

  const handleEdit = (building: Building) => {
    setSelectedBuilding(building)
    setFormOpen(true)
  }

  const handleDelete = (building: Building) => {
    setSelectedBuilding(building)
    setDeleteOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedBuilding(null)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setSelectedBuilding(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buildings</h1>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Create Building
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <div className="font-semibold">Failed to load buildings</div>
          <div className="text-sm mt-1">
            {error instanceof Error ? error.message : "Please try again"}
          </div>
        </div>
      )}

      <TableWrapper
        columns={
          <>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </>
        }
        isLoading={isLoading}
        emptyMessage="No buildings found"
      >
        {data?.items.map((building) => (
          <TableRow key={building.id}>
            <TableCell>{building.name}</TableCell>
            <TableCell>{building.code}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(building)}
                  title="Edit building"
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(building)}
                  title="Delete building"
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

      <BuildingForm
        open={formOpen}
        onOpenChange={handleFormClose}
        building={selectedBuilding || undefined}
      />

      <DeleteBuildingDialog
        open={deleteOpen}
        onOpenChange={handleDeleteClose}
        building={selectedBuilding}
      />
    </div>
  )
}
