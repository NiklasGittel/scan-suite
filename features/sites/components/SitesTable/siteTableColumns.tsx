"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type SiteTableFeatures } from "./siteTableFeatures"
import { type SiteListItem } from "@/db/queries/sites"
import VerificationDialog from "@/features/verification/components/VerificationDialog"
import { Delete } from "lucide-react"
import { DeleteSiteDialog } from "../DeleteSiteDialog"

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
    cell: ({ row }) => (
      <div className="flex justify-end">
        {row.original.status !== "verified" && <VerificationDialog site={row.original} />}        <div className="invisible group-hover:visible group-focus-within:visible">
          <DeleteSiteDialog site={row.original} />
        </div>
      </div>
    )
  }),
])
