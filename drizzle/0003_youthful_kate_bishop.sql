ALTER TABLE "calendar" RENAME COLUMN "client_id" TO "client_name";--> statement-breakpoint
ALTER TABLE "calendar" DROP CONSTRAINT "calendar_client_id_clients_id_fk";
