import {
  ArrowDownUpIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpNarrowWideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { RowData, type Column } from "@tanstack/react-table"
import { type DataTableFeatures } from "./dataTableFeatures"

const SORT_ICON = {
  asc: ArrowDownWideNarrowIcon,
  desc: ArrowUpNarrowWideIcon,
} as const

interface ColumnSortProps<TData extends RowData, TValue> {
  sorted: "asc" | "desc" | false
  column: Column<DataTableFeatures, TData, TValue>
}

const ColumnSort = <TData extends RowData, TValue>({
  sorted,
  column,
}: ColumnSortProps<TData, TValue>) => {
  if (!column.getCanSort()) return null
  const SortIcon = sorted ? SORT_ICON[sorted] : ArrowDownUpIcon
  return (
    <Button
      className={cn(
        "transition-opacity",
        "group-hover:opacity-100 focus-visible:opacity-100",
        !sorted && "text-muted-foreground opacity-0"
      )}
      variant="ghost"
      size="icon"
      aria-label={`Sort by ${column.id}`}
      onClick={column.getToggleSortingHandler()}
    >
      <SortIcon className="h-2 w-2" />
    </Button>
  )
}

export default ColumnSort
