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

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost";

export const SEVERITY_META: Record<FindingSeverity, { label: string; variant: BadgeVariant }> = {
    critical: { label: "Critical", variant: "destructive" },
    high: { label: "High", variant: "destructive" },
    medium: { label: "Medium", variant: "outline" },
    low: { label: "Low", variant: "secondary" },
    info: { label: "Info", variant: "ghost" },
};
