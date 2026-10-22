CREATE TYPE "public"."finding_category" AS ENUM('seo', 'security', 'accessibility', 'geo', 'compliance');--> statement-breakpoint
CREATE TYPE "public"."finding_severity" AS ENUM('critical', 'high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."finding_status" AS ENUM('open', 'closed', 'false_positive');--> statement-breakpoint
CREATE TYPE "public"."scan_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"scanner_id" uuid NOT NULL,
	"first_scan_id" uuid NOT NULL,
	"last_scan_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"additional_info" text,
	"severity" "finding_severity" NOT NULL,
	"category" "finding_category" NOT NULL,
	"assignee_id" uuid,
	"discovered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"solved_at" timestamp with time zone,
	"status" "finding_status" DEFAULT 'open' NOT NULL,
	"location" text NOT NULL,
	"fingerprint" text NOT NULL,
	"cve" text,
	"cwe" text,
	CONSTRAINT "findings_site_scanner_fingerprint_unique" UNIQUE("site_id","fingerprint","scanner_id")
);
--> statement-breakpoint
CREATE TABLE "scanners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	"custom" boolean DEFAULT false NOT NULL,
	CONSTRAINT "scanners_slug_unique" UNIQUE("slug"),
	CONSTRAINT "scanners_custom_has_owner" CHECK ((custom and owner_id is not null) or (not custom and owner_id is null))
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"scanner_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"status" "scan_status" DEFAULT 'pending' NOT NULL,
	"error" text
);
--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_scanner_id_scanners_id_fk" FOREIGN KEY ("scanner_id") REFERENCES "public"."scanners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_first_scan_id_scans_id_fk" FOREIGN KEY ("first_scan_id") REFERENCES "public"."scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_last_scan_id_scans_id_fk" FOREIGN KEY ("last_scan_id") REFERENCES "public"."scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scanners" ADD CONSTRAINT "scanners_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_scanner_id_scanners_id_fk" FOREIGN KEY ("scanner_id") REFERENCES "public"."scanners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scans_site_id_started_at_index" ON "scans" USING btree ("site_id","started_at" DESC NULLS LAST);