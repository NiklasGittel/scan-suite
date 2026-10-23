import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, pgEnum, unique, boolean, check, index } from 'drizzle-orm/pg-core';

export const siteStatus = pgEnum('site_status', ['pending', 'verified', 'expired']);
export const verifyMethod = pgEnum('verify_method', ['dns', 'file', 'meta']);
export const findingStatus = pgEnum('finding_status', ['open', 'closed', 'false_positive']);
export const findingCategory = pgEnum('finding_category', ['seo', 'security', 'accessibility', 'geo', 'compliance']);
export const findingSeverity = pgEnum('finding_severity', ['critical', 'high', 'medium', 'low', 'info']);

export const scanStatus = pgEnum('scan_status', ['pending', 'running', 'completed', 'failed']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sites = pgTable('sites', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
    hostname: text('hostname').notNull().unique(),
    verificationToken: uuid('verification_token').notNull().defaultRandom(),
    status: siteStatus('status').notNull().default('pending'),
    verifiedMethod: verifyMethod('verified_method'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    lastCheckedAt: timestamp('last_checked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

//TODO add scope, to prevent auto closing of findings due to narrower scope
export const findings = pgTable('findings', {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    scannerId: uuid('scanner_id').notNull().references(() => scanners.id, { onDelete: 'restrict' }),
    firstScanId: uuid('first_scan_id').notNull().references(() => scans.id),
    lastScanId: uuid('last_scan_id').notNull().references(() => scans.id ),
    title: text('title').notNull(),
    description: text('description'), //What it is about
    additionalInfo: text('additional_info'), //Resources and links
    severity: findingSeverity('severity').notNull(),
    category: findingCategory('category').notNull(),
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    discoveredAt: timestamp('discovered_at', { withTimezone: true }).notNull().defaultNow(),
    dueAt: timestamp('due_at', { withTimezone: true }),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    solvedAt: timestamp('solved_at', { withTimezone: true }),
    status: findingStatus('status').notNull().default('open'),
    location: text('location').notNull(),
    fingerprint: text('fingerprint').notNull(), // deduplicate findings across the SAME scanner - for different scanners tbd.
    cve: text('cve'),
    cwe: text('cwe'),
}, (table) => [
    unique('findings_site_scanner_fingerprint_unique').on(table.siteId, table.fingerprint, table.scannerId),
]);

export const scanners = pgTable('scanners', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'restrict' }),
    slug: text('slug').unique().notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    custom: boolean('custom').notNull().default(false)
}, (_) => [
    check('scanners_custom_has_owner', sql`(custom and owner_id is not null) or (not custom and owner_id is null)`),
]);

export const scans = pgTable('scans', {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    scannerId: uuid('scanner_id').notNull().references(() => scanners.id, { onDelete: 'restrict' }),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    status: scanStatus('status').notNull().default('pending'),
    error: text('error'),
}, (table) => [
    index('scans_site_id_started_at_index').on(table.siteId, table.startedAt.desc())
]);