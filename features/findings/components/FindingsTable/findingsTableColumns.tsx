"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { CATEGORY_META, SEVERITY_META } from "@/features/findings/constants"
import { formatDateTime } from "@/lib/format"
import { type DataTableFeatures } from "@/components/DataTable"
import { type Finding } from "@/db/types"

const columnHelper = createColumnHelper<DataTableFeatures, Finding>()

export const findingsTableColumns = columnHelper.columns([
  columnHelper.accessor("severity", {
    header: "Severity",
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
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    
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
      <span className="text-muted-foreground">{formatDateTime(getValue())}</span>
    ),
  }),
])
