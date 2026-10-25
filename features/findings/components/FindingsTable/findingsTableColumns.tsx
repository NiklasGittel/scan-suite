"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import {
  CATEGORY_FILTER_OPTIONS,
  CATEGORY_META,
  SEVERITY_FILTER_OPTIONS,
  SEVERITY_META,
  SEVERITY_RANK,
} from "@/features/findings/constants"
import { formatDateTime } from "@/lib/format"
import { type DataTableFeatures } from "@/components/DataTable"
import { type Finding, type FindingSeverity } from "@/db/types"

const columnHelper = createColumnHelper<DataTableFeatures, Finding>()

export const findingsTableColumns = columnHelper.columns([
  columnHelper.accessor("severity", {
    filterFn: "arrHas",
    sortFn: (rowA, rowB, columnId) =>
      SEVERITY_RANK[rowA.getValue<FindingSeverity>(columnId)] -
      SEVERITY_RANK[rowB.getValue<FindingSeverity>(columnId)],
    header: "Severity",
    meta: {
      filter: { variant: "faceted", options: SEVERITY_FILTER_OPTIONS },
    },
    cell: ({ getValue }) => {
      const { label, variant } = SEVERITY_META[getValue()]
      return <Badge variant={variant}>{label}</Badge>
    },
  }),
  columnHelper.accessor("title", {
    header: "Finding",
    meta: { filter: { variant: "text" } },
    filterFn: "includesString",
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: ({ getValue }) => <span>{getValue()}</span>,
    meta: { filter: { variant: "text" } },
    filterFn: "includesString",
  }),
  columnHelper.accessor("category", {
    filterFn: "arrHas",
    header: "Category",
    meta: {
      filter: { variant: "faceted", options: CATEGORY_FILTER_OPTIONS },
    },
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
    cell: ({ getValue }) => <span>{formatDateTime(getValue())}</span>,
  }),
])
