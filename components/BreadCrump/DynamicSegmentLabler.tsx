"use client"
import { useEffect } from "react"
import useDynamicLabels from "./dynamicSegmentLableStore"

export const DynamicSegmentLabler = ({ segment, label }: { segment: string; label: string }) => {
    useEffect(() => {
        useDynamicLabels.getState().setLabel(segment, label)
    }, [segment, label])
    return null
}
