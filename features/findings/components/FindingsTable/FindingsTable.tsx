"use client"

import { DataTable } from "@/components/DataTable"
import { type Finding } from "@/db/types"

import { findingsTableColumns } from "./findingsTableColumns"

export interface FindingsTableProps {
  findings: Finding[]
}

export function FindingsTable({
  findings,
}: FindingsTableProps) {
  return (
    <DataTable
      columns={findingsTableColumns}
      data={findings}
      emptyMessage="No findings yet."
    />
  )
}
