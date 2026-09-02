"use client"

import * as React from "react"
import { useTable, type ColumnDef, type ColumnFiltersState, type ColumnVisibilityState, type RowData, type SortingState, } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"
import { DataTableEmpty } from "./data-table-empty"
import { DataTablePagination } from "./data-table-pagination-advance"
import { DataTableSearchInput } from "./data-table-search-input"
import { DataTableViewOptions } from "./data-table-visibility-toggle"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  emptyTitle?: string
  emptyDescription?: string
  emptyFilteredTitle?: string
  emptyFilteredDescription?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyTitle,
  emptyDescription,
  emptyFilteredTitle,
  emptyFilteredDescription,
}: DataTableProps<TData>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
      const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const table = useTable({
    features,
    data,
    columns,
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <DataTableSearchInput table={table} />
          <DataTableViewOptions table={table} />
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
              <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                      return (
                      <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                          )}
                      </TableHead>
                      )
                  })}
                  </TableRow>
              ))}
              </TableHeader>
              <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                  <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                  >
                      {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                      </TableCell>
                      ))}
                  </TableRow>
                  ))
              ) : (
                  <TableRow className="hover:bg-transparent">
                  <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="p-0"
                  >
                      <DataTableEmpty
                          title={
                              data.length === 0
                                  ? emptyTitle
                                  : emptyFilteredTitle
                          }
                          description={
                              data.length === 0
                                  ? emptyDescription
                                  : emptyFilteredDescription
                          }
                      />
                  </TableCell>
                  </TableRow>
              )}
              </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
    </div>
  )
}