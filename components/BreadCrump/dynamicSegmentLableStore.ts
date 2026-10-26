"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"

export const isUnresolved = (stored: string | null | undefined) => stored === null


interface DynamicSegmentLabelState {
    // undefined -> still being resolved, null -> not found
    labels: Record<string, string | undefined | null>
    setLabel: (segment: string, label: string | null) => void
}

const useDynamicLabels = create<DynamicSegmentLabelState>()(
    devtools(
        (set) => ({
            labels: {},
            setLabel: (segment: string, label: string | null) => {
                set((state) =>
                    state.labels[segment] === label
                        ? state
                        : { labels: { ...state.labels, [segment]: label } },
                    false, "setLabel")
            },
        }),
        { name: "dynamic-segment-labels", enabled: process.env.NODE_ENV === "development" }
    )
)

export default useDynamicLabels
