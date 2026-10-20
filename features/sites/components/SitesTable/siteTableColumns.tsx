"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type SiteTableFeatures } from "./siteTableFeatures"
import { type SiteListItem } from "@/db/queries/sites"
import VerificationDialog from "@/features/verification/components/VerificationDialog"

const columnHelper = createColumnHelper<SiteTableFeatures, SiteListItem>()

export const siteTableColumns = columnHelper.columns([
  columnHelper.accessor("hostname", {
    header: "Hostname",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (row.original.status !== "verified" && (
      <div className="flex justify-end">
        <VerificationDialog site={row.original} />
      </div>
    )),
  }),
])
