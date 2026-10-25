"use client"

import {
  useTable,
  type CellData,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dataTableFeatures, type DataTableFeatures } from "./dataTableFeatures"
import ColumnSort from "./ColumnSort"
import ColumnFilter from "./filters/ColumnFilter"

export interface DataTableProps<TData extends RowData> {
  columns: Array<ColumnDef<DataTableFeatures, TData, CellData>>
  data: TData[]
  onRowClick?: (row: TData) => void
  emptyMessage?: string
  initialSorting?: SortingState
}

const SORT_LABEL = {
  asc: "ascending",
  desc: "descending",
} as const

export function DataTable<TData extends RowData>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No results.",
  initialSorting,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    initialState: initialSorting ? { sorting: initialSorting } : undefined,
  })
  const rows = table.getRowModel().rows
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { column } = header
                const sorted = column.getIsSorted()
                const filter = column.columnDef.meta?.filter
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={sorted ? SORT_LABEL[sorted] : undefined}
                    className="group"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        <div className="flex-1">
                          <table.FlexRender header={header} />
                        </div>
                        {filter && (
                          <ColumnFilter column={column} filter={filter} />
                        )}
                        <ColumnSort sorted={sorted} column={column} />
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={onRowClick ? "group cursor-pointer" : "group"}
                onClick={onRowClick && (() => onRowClick(row.original))}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
