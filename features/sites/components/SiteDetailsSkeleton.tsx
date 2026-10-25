import { Skeleton } from "@/components/ui/skeleton";

const FIELDS = ["Site Id", "Verification status", "Owner"];

export const SiteDetailsSkeleton = () => {
    return (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((label) => (
                <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd><Skeleton className="h-5 w-40" /></dd>
                </div>
            ))}
        </dl>
    );
}
