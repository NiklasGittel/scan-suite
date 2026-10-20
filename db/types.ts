import { sites, verifyMethod } from "./schema";

export type Site = typeof sites.$inferSelect;
export type VerifyMethod = (typeof verifyMethod.enumValues)[number];