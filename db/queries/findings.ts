import { db } from "..";
import { findings } from "../schema";
import { eq } from "drizzle-orm";

export const getFindingsForSite = async (siteId: string) => {
    return await db
        .select()
        .from(findings)
        .where(eq(findings.siteId, siteId));
};