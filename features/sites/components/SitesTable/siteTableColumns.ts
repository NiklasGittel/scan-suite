"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type SiteTableFeatures } from "./siteTableFeatures"
import { SiteListItem } from "@/db/queries/sites"

const columnHelper = createColumnHelper<SiteTableFeatures, SiteListItem>()

export const siteTableColumns = columnHelper.columns([

  columnHelper.accessor("hostname", {
    header: "Hostname",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
])