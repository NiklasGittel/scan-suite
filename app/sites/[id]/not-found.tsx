import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UnresolvedSegmentLabler } from "@/components/BreadCrump/UnresolvedSegmentLabler"

const NotFound = () => {
  return (
    <div className="flex flex-1 p-6">
      <UnresolvedSegmentLabler />
      <div className="flex w-full max-w-full min-w-0 flex-col items-start gap-4 text-sm">
        <h1 className="text-3xl font-bold">Site not found</h1>
        <p className="text-muted-foreground">
          The site you are looking for does not exist or was deleted.
        </p>
        <Button render={<Link href="/" />} variant="outline" size="sm">
          <ArrowLeftIcon />
          Back to sites
        </Button>
      </div>
    </div>
  )
}

export default NotFound
