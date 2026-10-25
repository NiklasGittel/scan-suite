"use client"

import { type Column, type RowData } from "@tanstack/react-table"
import { ListFilterIcon } from "lucide-react"

import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  type DataTableFeatures,
  type FacetedFilterOption,
} from "../dataTableFeatures"

export interface FacetedFilterProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>
  options: FacetedFilterOption[]
}

const FacetedFilter = <TData extends RowData, TValue>({
  column,
  options,
}: FacetedFilterProps<TData, TValue>) => {
  if (!column.getCanFilter()) return null

  const facets = column.getFacetedUniqueValues()
  const selected = new Set(
    (column.getFilterValue() as string[] | undefined) ?? []
  )

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column.setFilterValue(next.size ? Array.from(next) : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className={cn(
              "relative",
              selected.size === 0 && "text-muted-foreground"
            )}
            variant="ghost"
            size="icon"
          >
            <ListFilterIcon />
            {selected.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-medium tabular-nums">
                {selected.size}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-56 gap-0 p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map(({ value, label }) => (
                <CommandItem
                  key={value}
                  value={label}
                  className="w-full"
                  data-checked={selected.has(value)}
                  onSelect={() => toggle(value)}
                  disabled={(facets.get(value) ?? 0) === 0}
                >
                  <span className="flex-1 truncate">{label}</span>
                  <span className="text-xs">{facets.get(value) ?? 0}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                disabled={selected.size === 0}
                className="justify-center"
                onSelect={() => column.setFilterValue(undefined)}
              >
                Clear filter
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default FacetedFilter
