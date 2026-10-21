import { notFound } from "next/navigation"
import { getSite } from "@/db/queries/sites"
import type { Finding } from "@/features/findings/types"
import { SiteDetails } from "@/features/sites/components/SiteDetails"

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const site = await getSite(id)

    if (!site) notFound()

    const findings: Finding[] = []

    return (
        <div className="flex min-h-svh p-6">
            <div className="flex w-full max-w-full min-w-0 flex-col gap-4 text-sm">
                <h1 className="text-3xl font-bold">{site.hostname}</h1>
                <SiteDetails site={site} />
            
            </div>
        </div>
    )
}
