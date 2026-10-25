"use client"

import { type Column, type RowData } from "@tanstack/react-table"
import { SearchIcon } from "lucide-react"

import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { type DataTableFeatures } from "../dataTableFeatures"

export interface TextFilterProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>
  placeholder?: string
}

const TextFilter = <TData extends RowData, TValue>({
  column,
  placeholder,
}: TextFilterProps<TData, TValue>) => {
  if (!column.getCanFilter()) return null

  const value = (column.getFilterValue() as string | undefined) ?? ""

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className={cn(value === "" && "text-muted-foreground")}
            variant="ghost"
            size="icon"
          >
            <SearchIcon />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-56 p-2">
        <Input
          autoFocus
          value={value}
          placeholder={placeholder ?? `Filter ${column.id}`}
          onChange={(event) =>
            column.setFilterValue(
              event.target.value === "" ? undefined : event.target.value
            )
          }
        />
      </PopoverContent>
    </Popover>
  )
}

export default TextFilter
