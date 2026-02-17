"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getBuildings } from "@/lib/api/building.api"
import { TableWrapper } from "@/components/shared/TableWrapper"
import { TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function BuildingsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ["buildings", page],
    queryFn: () => getBuildings({ page, pageSize: 10 }),
  })

  // Debug logging
  if (error) {
    console.error("Buildings Query Error:", error)
  }
  if (data) {
    console.log("Buildings Data:", data)
  }

  const hasPrevious = page > 1
  const hasNext = data ? page < data.totalPages : false

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Buildings</h1>

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
          </>
        }
        isLoading={isLoading}
        emptyMessage="No buildings found"
      >
        {data?.items.map((building) => (
          <TableRow key={building.id}>
            <TableCell>{building.name}</TableCell>
            <TableCell>{building.code}</TableCell>
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
    </div>
  )
}
