import { Site } from "@/db/types";

export const SiteDetails = ({ site }: { site: Site }) => {
    return (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Site Id" value={site.id} />
            <Info label="Verification status" value={site.status} />
            <Info label="Owner" value={site?.ownerId ?? "—"} mono />
        </dl>
    );
}

const Info = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div className="flex flex-col gap-0.5">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className={mono ? "font-mono break-all" : "break-all"}>{value}</dd>
    </div>
)