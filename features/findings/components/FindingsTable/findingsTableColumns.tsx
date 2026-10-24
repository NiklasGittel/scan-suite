"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import {
  CATEGORY_FILTER_OPTIONS,
  CATEGORY_META,
  SEVERITY_FILTER_OPTIONS,
  SEVERITY_META,
} from "@/features/findings/constants"
import { formatDateTime } from "@/lib/format"
import { DataTableFacetedFilter, type DataTableFeatures } from "@/components/DataTable"
import { type Finding } from "@/db/types"

const columnHelper = createColumnHelper<DataTableFeatures, Finding>()

export const findingsTableColumns = columnHelper.columns([
  columnHelper.accessor("severity", {
    filterFn: "arrHas",
    header: ({ column }) => (
      <div className="flex items-center justify-between">
        Severity
        <DataTableFacetedFilter
          column={column}
          options={SEVERITY_FILTER_OPTIONS}
        />
      </div>
    ),
    cell: ({ getValue }) => {
      const { label, variant } = SEVERITY_META[getValue()]
      return <Badge variant={variant}>{label}</Badge>
    },
  }),
  columnHelper.accessor("title", {
    header: "Finding",
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    filterFn: "arrHas",
    header: ({ column }) => (
      <div className="flex items-center justify-between">
        Category
        <DataTableFacetedFilter
          column={column}
          options={CATEGORY_FILTER_OPTIONS}
        />
      </div>
    ),
    cell: ({ getValue }) => {
      const { label, Icon } = CATEGORY_META[getValue()]
      return (
        <Badge variant="secondary">
          <Icon />
          {label}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("discoveredAt", {
    header: "Detected",
    cell: ({ getValue }) => (
      <span>{formatDateTime(getValue())}</span>
    ),
  }),
])
