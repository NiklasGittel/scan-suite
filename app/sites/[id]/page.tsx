import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getSite } from "@/db/queries/sites"
import { SiteDetails } from "@/features/sites/components/SiteDetails"
import { getFindingsForSite } from "@/db/queries/findings"
import { FindingsTable, FindingsTableSkeleton } from "@/features/findings/components/FindingsTable"
import { DynamicSegmentLabler } from "@/components/BreadCrump/DynamicSegmentLabler"

const SiteFindings = async ({ id }: { id: string }) => {
    const findings = await getFindingsForSite(id)

    return <FindingsTable findings={findings} />
}

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const site = await getSite(id)
    if (!site) notFound()

    return (
        <div className="flex flex-1 px-6">
            <div className="flex w-full max-w-full min-w-0 flex-col gap-4 text-sm">
                <DynamicSegmentLabler segment={id} label={site.hostname} />
                <h1 className="text-3xl font-bold">{site.hostname}</h1>
                <SiteDetails site={site} />
                <Suspense fallback={<FindingsTableSkeleton />}>
                    <SiteFindings id={id} />
                </Suspense>
            </div>
        </div>
    )
}
