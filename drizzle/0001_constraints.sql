ALTER TABLE "sites" DROP CONSTRAINT "sites_owner_id_hostname_unique";--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_hostname_unique" UNIQUE("hostname");