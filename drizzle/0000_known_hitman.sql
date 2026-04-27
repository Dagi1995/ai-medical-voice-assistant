DROP TABLE IF EXISTS "aiDoctorKnowledge";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aiDoctorKnowledge" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "aiDoctorKnowledge_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"doctorId" integer,
	"content" text NOT NULL,
	"embedding" vector(3072)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aiDoctors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "aiDoctors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"specialty" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"agentPrompt" text NOT NULL,
	"voiceId" varchar(100),
	"imageUrl" varchar,
	"hasRag" boolean DEFAULT false,
	"createdOn" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessionsChatTable" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessionsChatTable_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sessionId" varchar NOT NULL,
	"language" varchar DEFAULT 'English',
	"notes" text,
	"selectedDoctor" json,
	"conversation" json,
	"report" json,
	"createdBy" varchar,
	"createdOn" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer DEFAULT 0,
	"role" varchar(20) DEFAULT 'Patient',
	"status" varchar(20) DEFAULT 'Active',
	"lastActive" varchar,
	"imageUrl" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "aiDoctorKnowledge" ADD CONSTRAINT "aiDoctorKnowledge_doctorId_aiDoctors_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."aiDoctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionsChatTable" ADD CONSTRAINT "sessionsChatTable_createdBy_users_email_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;