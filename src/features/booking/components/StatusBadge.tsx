import { BookingStatus } from "@/types/booking"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: BookingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = {
    Pending: "outline" as const,
    Approved: "default" as const,
    Rejected: "destructive" as const,
  }[status]

  return <Badge variant={variant}>{status}</Badge>
}
