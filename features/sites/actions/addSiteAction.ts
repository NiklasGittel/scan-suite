'use server';
import { revalidatePath } from 'next/cache';
import { createSite } from '@/db/queries/sites';
import { AddSiteInput } from '../schemas';

export type AddSiteActionError = 'invalid_input' | 'already_exists';

export type AddSiteActionState = {
    success?: boolean;
    error?: AddSiteActionError;
    fieldErrors?: Record<string, string[] | undefined>;
};

export async function addSiteAction(_prev: AddSiteActionState, formData: FormData): Promise<AddSiteActionState> {
    const parsed = AddSiteInput.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { success: false, error: 'invalid_input' };

    const site = await createSite(parsed.data.hostname);
    if (!site) return { success: false, error: 'already_exists' };

    revalidatePath('/');
    return { success: true };
}
