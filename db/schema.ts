import { pgTable, uuid, text, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';

export const siteStatus = pgEnum('site_status', ['pending', 'verified', 'expired']);
export const verifyMethod = pgEnum('verify_method', ['dns', 'file', 'meta']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sites = pgTable('sites', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    hostname: text('hostname').notNull(),
    verificationToken: uuid('verification_token').notNull().defaultRandom(),
    status: siteStatus('status').notNull().default('pending'),
    verifiedMethod: verifyMethod('verified_method'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    lastCheckedAt: timestamp('last_checked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.ownerId, t.hostname)]);