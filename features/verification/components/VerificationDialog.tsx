"use client";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Site, type VerifyMethod } from "@/db/types";
import { META_VERIFY_NAME } from "@/features/verification/constants";
import { VerifyActionError, verifySiteAction } from "../actions/verifySiteAction";
import { Item, ItemContent, ItemDescription, ItemActions } from "@/components/ui/item";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

const selectItems: Record<VerifyMethod, string> = {
    dns: "DNS record",
    file: "Txt file",
    meta: "Meta tag",
};

//TODO
const explanations: Record<VerifyMethod, string> = {
    dns: "Add a DNS record to your domain's DNS settings.",
    file: "Upload a verification file to your website.",
    meta: "Add a meta tag to the <head> section of your website.",
};

const getCopyValue: Record<VerifyMethod, (siteId: string) => string> = {
    dns: (siteId) => `${siteId}`,
    file: (siteId) => `${siteId}`,
    meta: (siteId) => `<meta name=\"${META_VERIFY_NAME}\" content=\"${siteId}\" />`,
};

const getErrorMessage: Record<VerifyActionError, string> = {
    not_found: "We couldn't find the record yet. Try again shortly.",
    mismatch: "Token doesn't match.",
    unreachable: "We couldn't reach your site. Check that it's online and try again.",
    invalid_input: "The input provided is invalid.",
    site_not_found: "The site could not be found."
};

const VerifyForm = ({ site }: { site: Pick<Site, "id" | "hostname"> }) => {
    const [method, setMethod] = useState<VerifyMethod>("dns");
    const [copied, setCopied] = useState(false);
    const [state, formAction, isPending] = useActionState(verifySiteAction, {});

    const onCopyClick = () => {
        navigator.clipboard.writeText(getCopyValue[method](site.id));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <form action={formAction} className="grid gap-6">
            <input type="hidden" name="siteId" value={site.id} />
            <DialogHeader>
                <DialogTitle>Site verification </DialogTitle>
                <DialogDescription>
                    Please choose your verification method for <span className="font-mono">{site.hostname}</span>
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                    <Label htmlFor="method">Verification method</Label>
                    <Select items={Object.entries(selectItems).map(([value, label]) => ({ value, label }))} value={method} onValueChange={(value) => setMethod(value as VerifyMethod)} name="method" id="method">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Verification method" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(selectItems).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Item variant="outline">
                    <ItemContent>
                        <ItemDescription>
                            {getCopyValue[method](site.id)}
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button size="icon" variant="ghost" onClick={onCopyClick}>
                            {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                        </Button>
                    </ItemActions>
                </Item>
            </FieldGroup>
            {state.error && <p className="text-destructive">{getErrorMessage[state.error as VerifyActionError]}</p>}
            <DialogFooter>
                <Button type="submit" disabled={isPending}>Verify</Button>
            </DialogFooter>
        </form>
    );
};

const VerificationDialog = ({ site }: { site: Pick<Site, "id" | "hostname"> }) => {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" size="sm">Verify</Button>} />
            <DialogContent >
                <VerifyForm site={site} />
            </DialogContent>
        </Dialog>
    );
};

export default VerificationDialog;
