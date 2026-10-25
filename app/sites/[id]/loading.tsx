import { Skeleton } from "@/components/ui/skeleton"
import { SiteDetailsSkeleton } from "@/features/sites/components/SiteDetailsSkeleton"
import { FindingsTableSkeleton } from "@/features/findings/components/FindingsTable"

const Loading = () => {
    return (
        <div className="flex flex-1 p-6">
            <div className="flex w-full max-w-full min-w-0 flex-col gap-4 text-sm">
                <Skeleton className="h-9 w-64" />
                <SiteDetailsSkeleton />
                <FindingsTableSkeleton />
            </div>
        </div>
    )
}

export default Loading
