"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { PlusIcon, PencilIcon, Trash2Icon, RefreshCwIcon } from "lucide-react"
import { getBookings } from "@/lib/api/booking.api"
import { getBuildings } from "@/lib/api/building.api"
import { getRooms } from "@/lib/api/room.api"
import { Booking, BookingStatus } from "@/types/booking"
import { TableWrapper } from "@/components/shared/TableWrapper"
import { TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookingForm } from "@/features/booking/components/BookingForm"
import { DeleteBookingDialog } from "@/features/booking/components/DeleteBookingDialog"
import { StatusBadge } from "@/features/booking/components/StatusBadge"
import { StatusUpdateDialog } from "@/features/booking/components/StatusUpdateDialog"
import { cn } from "@/lib/utils"

const STATUSES: BookingStatus[] = ["Pending", "Approved", "Rejected"]

export default function BookingsPage() {
  const [page, setPage] = useState(1)
  const [buildingId, setBuildingId] = useState<string>("")
  const [roomId, setRoomId] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [borrowerName, setBorrowerName] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getBuildings({ page: 1, pageSize: 100 }),
  })

  const { data: roomsData } = useQuery({
    queryKey: ["rooms", { buildingId }],
    queryFn: () =>
      getRooms({
        page: 1,
        pageSize: 100,
        buildingId: buildingId || undefined,
      }),
    enabled: !!buildingId,
  })

  // Fetch ALL rooms for lookup (to get building_id from room_id)
  const { data: allRoomsData } = useQuery({
    queryKey: ["rooms", "all"],
    queryFn: () =>
      getRooms({
        page: 1,
        pageSize: 1000,
      }),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", { page, buildingId, roomId, status, borrowerName, startDate, endDate }],
    queryFn: () =>
      getBookings({
        Page: page,
        PageSize: 10,
        BuildingId: buildingId || undefined,
        RoomId: roomId || undefined,
        Status: status || undefined,
        BorrowerName: borrowerName || undefined,
        StartDate: startDate || undefined,
        EndDate: endDate || undefined,
      }),
  })

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [buildingId, roomId, status, borrowerName, startDate, endDate])

  // Reset room when building changes
  useEffect(() => {
    setRoomId("")
  }, [buildingId])

  const hasPrevious = page > 1
  const hasNext = data ? page < data.totalPages : false

  const handleCreate = () => {
    setSelectedBooking(null)
    setFormOpen(true)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setFormOpen(true)
  }

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking)
    setDeleteOpen(true)
  }

  const handleStatusUpdate = (booking: Booking) => {
    setSelectedBooking(booking)
    setStatusOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedBooking(null)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setSelectedBooking(null)
  }

  const handleStatusClose = () => {
    setStatusOpen(false)
    setSelectedBooking(null)
  }

  const handleClearFilters = () => {
    setBuildingId("")
    setRoomId("")
    setStatus("")
    setBorrowerName("")
    setStartDate("")
    setEndDate("")
  }

  const getBuildingInfo = (roomIdParam: string) => {
    const room = allRoomsData?.items.find((r) => r.id === roomIdParam)
    if (!room) return { buildingName: "Unknown", roomName: "Unknown" }
    
    const building = buildingsData?.items.find((b) => b.id === room.building_id)
    return {
      buildingName: building ? building.name : "Unknown",
      roomName: room.name,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Create Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <RefreshCwIcon className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="building-filter" className="text-sm font-medium">
              Building
            </label>
            <select
              id="building-filter"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          <div className="space-y-2">
            <label htmlFor="room-filter" className="text-sm font-medium">
              Room
            </label>
            <select
              id="room-filter"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
              disabled={!buildingId}
            >
              <option value="">All Rooms</option>
              {roomsData?.items.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="borrower-filter" className="text-sm font-medium">
              Borrower Name
            </label>
            <Input
              id="borrower-filter"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Search by name..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="start-date-filter" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="start-date-filter"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="end-date-filter" className="text-sm font-medium">
              End Date
            </label>
            <Input
              id="end-date-filter"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <div className="font-semibold">Failed to load bookings</div>
          <div className="text-sm mt-1">
            {error instanceof Error ? error.message : "Please try again"}
          </div>
        </div>
      )}

      <TableWrapper
        columns={
          <>
            <TableHead>Borrower</TableHead>
            <TableHead>Building</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </>
        }
        isLoading={isLoading}
        emptyMessage="No bookings found"
      >
        {data?.items.map((booking) => {
          const { buildingName, roomName } = getBuildingInfo(booking.room_id)
          return (
            <TableRow key={booking.id}>
              <TableCell>{booking.borrower_name}</TableCell>
              <TableCell>{buildingName}</TableCell>
              <TableCell>{roomName}</TableCell>
              <TableCell>
                {new Date(booking.booking_start).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(booking.booking_end).toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleStatusUpdate(booking)}
                    title="Update status"
                  >
                    <RefreshCwIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEdit(booking)}
                    title="Edit booking"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(booking)}
                    title="Delete booking"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
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

      <BookingForm
        open={formOpen}
        onOpenChange={handleFormClose}
        booking={selectedBooking || undefined}
      />

      <DeleteBookingDialog
        open={deleteOpen}
        onOpenChange={handleDeleteClose}
        booking={selectedBooking}
      />

      <StatusUpdateDialog
        open={statusOpen}
        onOpenChange={handleStatusClose}
        booking={selectedBooking}
      />
    </div>
  )
}

