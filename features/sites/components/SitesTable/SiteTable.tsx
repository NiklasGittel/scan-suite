"use client"

import { useRouter } from "next/navigation"

import { DataTable } from "@/components/DataTable"
import { type SiteListItem } from "@/db/queries/sites"

import { siteTableColumns } from "./siteTableColumns"

export interface SiteTableProps {
  data: SiteListItem[]
}

export function SiteTable({
  data,
}: SiteTableProps) {
  const router = useRouter();
  return (
    <DataTable
      columns={siteTableColumns}
      data={data}
      onRowClick={(site) => router.push(`/sites/${site.id}`)}
    />
  )
}
