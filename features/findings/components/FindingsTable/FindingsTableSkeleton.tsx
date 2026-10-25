import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const COLUMNS = [
  { header: "Severity", width: "w-16" },
  { header: "Finding", width: "w-48" },
  { header: "Location", width: "w-40" },
  { header: "Category", width: "w-24" },
  { header: "Detected", width: "w-32" },
]

export interface FindingsTableSkeletonProps {
  rows?: number
}

export function FindingsTableSkeleton({ rows = 5 }: FindingsTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ header }) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => (
            <TableRow key={i}>
              {COLUMNS.map(({ header, width }) => (
                <TableCell key={header}>
                  <Skeleton className={`h-4 ${width}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
