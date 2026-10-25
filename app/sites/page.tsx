import { getSites } from "@/db/queries/sites";
import { SiteTable } from "@/features/sites/components/SitesTable";
import AddSiteDialog from "@/features/sites/components/AddSiteDialog";

export default async function Page() {
  const sites = await getSites();

  return (
    <div className="flex flex-1 p-6">
      <div className="flex max-w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="overflow-hidden rounded-md border">
          <SiteTable data={sites}></SiteTable>
        </div>
        <div className="flex">
          <AddSiteDialog />
        </div>
      </div>
    </div>
  )
}
