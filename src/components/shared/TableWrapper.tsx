"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface TableWrapperProps {
  columns: React.ReactNode
  children: React.ReactNode
  isLoading?: boolean
  emptyMessage?: string
}

export function TableWrapper({
  columns,
  children,
  isLoading = false,
  emptyMessage = "No data available",
}: TableWrapperProps) {
  const childrenArray = React.Children.toArray(children)
  const isEmpty = childrenArray.length === 0

  return (
    <Table>
      <TableHeader>
        <TableRow>{columns}</TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={100} className="h-24 text-center">
              <Skeleton className="h-8 w-full" />
            </TableCell>
          </TableRow>
        ) : isEmpty ? (
          <TableRow>
            <TableCell colSpan={100} className="h-24 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          children
        )}
      </TableBody>
    </Table>
  )
}
