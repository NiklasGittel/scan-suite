import { VerifyMethod } from '@/db/types';
import { fetchTokensFromDns } from './dns';
import { fetchTokensFromFile } from './file';
import { fetchTokensFromMeta } from './meta';
import type { Site } from '@/db/types';

const fetchers: Record<VerifyMethod, (hostname: string) => Promise<string[] | null>> = {
    dns: fetchTokensFromDns,
    file: fetchTokensFromFile,
    meta: fetchTokensFromMeta,
};

type VerificationResult =
    | { success: true }
    | { success: false; reason: 'not_found' | 'mismatch' | 'unreachable' };

export const verifySite = async (site: Pick<Site, 'hostname' | 'verificationToken'>, method: VerifyMethod): Promise<VerificationResult> => {
    const tokens = await fetchers[method](site.hostname);
    if (!tokens) return { success: false, reason: 'unreachable' };
    if (tokens.length === 0) return { success: false, reason: 'not_found' };
    if (!tokens.includes(site.verificationToken)) return { success: false, reason: 'mismatch' };
    return { success: true };
};
