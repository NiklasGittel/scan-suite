"use server";
import { revalidatePath } from "next/cache";
import { DeleteSiteInput } from "../schemas";

export type DeleteSiteActionError = 'not_found' | 'unauthorized' | 'invalid_input';

interface DeleteSiteActionState {
    success?: boolean;
    error?: DeleteSiteActionError;
}

import { deleteSite } from "@/db/queries/sites";

export const deleteSiteAction = async (siteId: string): Promise<DeleteSiteActionState> => {
    const parsed = DeleteSiteInput.safeParse({ siteId });
    if (!parsed.success) return { error: 'invalid_input' };
    const deleted = 
        await deleteSite(siteId)
        .then(() => true)
        .catch(() => false);
    //TODO: handle different types of errors
    if (!deleted) return { error: 'not_found' };
    revalidatePath('/');
    return { success: true };
}