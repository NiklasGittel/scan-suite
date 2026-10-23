import { sites, verifyMethod, findings } from "./schema";

export type Site = typeof sites.$inferSelect;
export type VerifyMethod = (typeof verifyMethod.enumValues)[number];

export type Finding = typeof findings.$inferSelect;
export type FindingSeverity = (typeof findings.$inferSelect["severity"]);
export type FindingCategory = (typeof findings.$inferSelect["category"]);