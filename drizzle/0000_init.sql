CREATE TYPE "public"."site_status" AS ENUM('pending', 'verified', 'expired');--> statement-breakpoint
CREATE TYPE "public"."verify_method" AS ENUM('dns', 'file', 'meta');--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"hostname" text NOT NULL,
	"verification_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "site_status" DEFAULT 'pending' NOT NULL,
	"verified_method" "verify_method",
	"verified_at" timestamp with time zone,
	"last_checked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sites_owner_id_hostname_unique" UNIQUE("owner_id","hostname")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;