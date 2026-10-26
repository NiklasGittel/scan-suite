import {
    GavelIcon,
    PersonStandingIcon,
    SearchIcon,
    ShieldIcon,
    SparklesIcon,
    type LucideIcon,
} from "lucide-react";
import type { FindingCategory, FindingSeverity } from "@/db/types";

export const CATEGORY_META: Record<FindingCategory, { label: string; Icon: LucideIcon }> = {
    seo: { label: "SEO", Icon: SearchIcon },
    geo: { label: "GEO", Icon: SparklesIcon },
    security: { label: "Security", Icon: ShieldIcon },
    accessibility: { label: "Accessibility", Icon: PersonStandingIcon },
    compliance: { label: "Compliance", Icon: GavelIcon },
};

export const CATEGORY_FILTER_OPTIONS = Object.entries(CATEGORY_META).map(
    ([value, { label }]) => ({ value, label }),
);

type BadgeVariant = "default" | "secondary" | "destructive" | "orange" | "warning" | "info" | "outline" | "ghost";

export const SEVERITY_META: Record<FindingSeverity, { label: string; variant: BadgeVariant }> = {
    critical: { label: "Critical", variant: "destructive" },
    high: { label: "High", variant: "destructive" },
    medium: { label: "Medium", variant: "orange" },
    low: { label: "Low", variant: "warning" },
    info: { label: "Info", variant: "info" },
};

export const SEVERITY_FILTER_OPTIONS = Object.entries(SEVERITY_META).map(([value, { label }]) => ({ value, label }));

export const SEVERITY_RANK = Object.fromEntries(
    Object.keys(SEVERITY_META).map((severity, index) => [severity, index]),
) as Record<FindingSeverity, number>;



