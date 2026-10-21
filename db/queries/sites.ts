import 'server-only';
import { db } from '../index';
import { sites } from '../schema';
import { eq } from 'drizzle-orm';
import { VerifyMethod } from '../types';

export const getSites = async () => {
    return db.select({
        id: sites.id,
        hostname: sites.hostname,
        status: sites.status,
        verifiedAt: sites.verifiedAt,
    }).from(sites);
}

export async function getSite(siteId: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, siteId));
  return site ?? null;
}

export async function createSite(hostname: string) {
  const [site] = await db
    .insert(sites)
    .values({ hostname })
    .onConflictDoNothing({ target: sites.hostname })
    .returning({ id: sites.id });
  return site ?? null;
}

export async function markSiteVerified(siteId: string, method: VerifyMethod) {
  await db.update(sites)
    .set({ status: 'verified', verifiedMethod: method, verifiedAt: new Date(), lastCheckedAt: new Date() })
    .where(eq(sites.id, siteId));
}

export type SiteListItem = Awaited<ReturnType<typeof getSites>>[number];