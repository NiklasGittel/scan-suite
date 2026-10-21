import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import type { DeleteSiteActionError } from "../actions/deleteSiteAction";
import { type SiteListItem } from "@/db/queries/sites";
import { deleteSiteAction } from "../actions/deleteSiteAction";

const errorMessages: Record<DeleteSiteActionError, string> = {
    not_found: 'The site could not be found.',
    unauthorized: 'You are not authorized to delete this site.',
    invalid_input: 'Invalid input.'
};

const getErrorMessage = (error: DeleteSiteActionError) => errorMessages[error];

export const DeleteSiteDialog = ({ site: { id, hostname } }: { site: Pick<SiteListItem, "id" | "hostname"> }) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="ghost" size="icon"><TrashIcon className="text-destructive" /></Button>} />
            <DialogContent>
                <DeleteSiteForm site={{ id, hostname }} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

const DeleteSiteForm = ({ site: { id, hostname }, onSuccess }: { site: Pick<SiteListItem, "id" | "hostname">, onSuccess: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<DeleteSiteActionError | undefined>(undefined);

    const onDelete = () => {
        startTransition(async () => {
            const result = await deleteSiteAction(id);
            if (result.success) {
                onSuccess();
            } else {
                setError(result.error);
            }
        });
    };

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Delete site</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete the site <span className="font-mono">{hostname}</span>? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            {error && <p className="text-destructive">{getErrorMessage(error)}</p>}
            <DialogFooter>
                <Button variant="destructive" onClick={onDelete} disabled={isPending}>Delete</Button>
            </DialogFooter>
        </div>
    );
};