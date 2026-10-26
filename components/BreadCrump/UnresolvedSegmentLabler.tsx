"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
    import useDynamicLabels from "./dynamicSegmentLableStore"

export const UnresolvedSegmentLabler = () => {
    const pathname = usePathname()

    useEffect(() => {
        const segment = pathname.split("/").filter(Boolean).pop()
        if (segment) useDynamicLabels.getState().setLabel(segment, null)
    }, [pathname])

    return null
}
