CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar NOT NULL,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"type" varchar DEFAULT 'info',
	"read" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "aiDoctorKnowledge" DROP CONSTRAINT "aiDoctorKnowledge_doctorId_aiDoctors_id_fk";
--> statement-breakpoint
ALTER TABLE "aiDoctorKnowledge" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "aiDoctors" ALTER COLUMN "imageUrl" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "sessionsChatTable" ADD COLUMN "status" varchar DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "aiDoctorKnowledge" ADD CONSTRAINT "aiDoctorKnowledge_doctorId_aiDoctors_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."aiDoctors"("id") ON DELETE cascade ON UPDATE no action;