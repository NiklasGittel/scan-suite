'use server';
import { revalidatePath } from 'next/cache';
import { getSite, markSiteVerified } from '@/db/queries/sites';
import { VerifySiteInput } from '../../sites/schemas';
import { verifySite } from '@/features/verification';
import type { VerifyError } from '@/features/verification/types';

export type VerifyActionError = VerifyError | 'invalid_input' | 'site_not_found'; 

export type VerifyActionState = {
    success?: boolean;
    error?: VerifyActionError;
    fieldErrors?: Record<string, string[] | undefined>;
};

export async function verifySiteAction(_prev: VerifyActionState, formData: FormData): Promise<VerifyActionState> {
    console.log("Parsed form data:", Object.fromEntries(formData));

    const parsed = VerifySiteInput.safeParse(Object.fromEntries(formData));
    console.log("Parsed result:", parsed);
    if (!parsed.success) return { success: false, error: 'invalid_input' };

    const { siteId, method } = parsed.data;

    const site = await getSite(siteId);
    if (!site) return { success: false, error: 'site_not_found' };

    const result = await verifySite(site, method);
    if (!result.success) return { success: false, error: result.reason };

    await markSiteVerified(site.id, method);
    revalidatePath('/');
    return { success: true };
}