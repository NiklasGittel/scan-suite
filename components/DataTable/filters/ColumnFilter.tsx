"use client"
import { cn } from "cn"

import { type Column, type RowData } from "@tanstack/react-table"
import {
  type DataTableFeatures,
  type DataTableFilter,
} from "../dataTableFeatures"
import FacetedFilter from "./FacetedFilter"
import TextFilter from "./TextFilter"

export interface ColumnFilterProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>
  filter: DataTableFilter
}

const ColumnFilter = <TData extends RowData, TValue>({
  column,
  filter,
}: ColumnFilterProps<TData, TValue>) => {
  if (!column.getCanFilter()) return null
  const child = (() => {
    switch (filter.variant) {
      case "faceted":
        return <FacetedFilter column={column} options={filter.options} />
      case "text":
        return <TextFilter column={column} placeholder={filter.placeholder} />
    }
  })()
  return (
    <div
      className={cn(
        "opacity-0 transition-opacity group-hover:opacity-100",
        "has-[:focus-visible]:opacity-100 has-[[data-popup-open]]:opacity-100",
        column.getIsFiltered() && "opacity-100"
      )}
    >
      {child}
    </div>
  )
}
export default ColumnFilter
