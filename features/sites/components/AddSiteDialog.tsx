"use client";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddSiteActionError, addSiteAction } from "../actions/addSiteAction";
import { PlusIcon } from "lucide-react";

const getErrorMessage: Record<AddSiteActionError, string> = {
    invalid_input: "Enter a domain like example.com.",
    already_exists: "That site has already been added.",
};

const AddSiteForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [state, formAction, isPending] = useActionState(addSiteAction, {});

    useEffect(() => {
        if (state.success) onSuccess();
    }, [state.success, onSuccess]);

    return (
        <form action={formAction} className="grid gap-6">
            <DialogHeader>
                <DialogTitle>Add site</DialogTitle>
                <DialogDescription>
                    Add the site you want to scan. You can verify ownership afterwards.
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                    <Label htmlFor="hostname">Hostname</Label>
                    <Input id="hostname" name="hostname" placeholder="example.com" autoComplete="off" autoFocus />
                    <FieldDescription>The domain without protocol or path.</FieldDescription>
                </Field>
            </FieldGroup>
            {state.error && <p className="text-destructive">{getErrorMessage[state.error]}</p>}
            <DialogFooter>
                <Button type="submit" disabled={isPending}>Add site</Button>
            </DialogFooter>
        </form>
    );
};

const AddSiteDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm"><PlusIcon />Add site</Button>} />
            <DialogContent>
                <AddSiteForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default AddSiteDialog;
