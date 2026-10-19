import 'server-only';
import { db } from '../index';
import { sites } from '../schema';

export const getSites = async () => {
    return db.select({
        id: sites.id,
        hostname: sites.hostname,
        status: sites.status,
        verifiedAt: sites.verifiedAt,
    }).from(sites);
}

export type SiteListItem = Awaited<ReturnType<typeof getSites>>[number];