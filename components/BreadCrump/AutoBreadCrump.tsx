"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import useDynamicSegmentLabels, { isUnresolved } from "./dynamicSegmentLableStore"
import React from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Skeleton } from "../ui/skeleton"


const SEGMENT_LABELS: Record<string, string> = {
    sites: "Sites",
    findings: "Findings",
    plugins: "Plugins",
    iam: "IAM",
}

const AutoBreadCrump = () => {
    const segments = useSelectedLayoutSegments().filter((segment) => !segment.startsWith("("))
    const labels = useDynamicSegmentLabels((state) => state.labels)

    if (segments.length === 0) return null

    const items: { label: string; href: string; pending: boolean }[] = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const stored = labels[segment]

        if (isUnresolved(stored)) return { label: "Unknown", href, pending: false }

        const label = stored ?? SEGMENT_LABELS[segment]
        return { label: label ?? segment, href, pending: label === undefined }
    })

    return (
        <Breadcrumb className="text-xs">
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <React.Fragment key={item.href}>
                            <BreadcrumbItem>
                                {item.pending ? (
                                    <Skeleton className="h-3 w-20" />
                                ) : isLast ? (
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default AutoBreadCrump
