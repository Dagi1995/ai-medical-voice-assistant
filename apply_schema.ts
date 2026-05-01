import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Applying manual schema changes...');

  try {
    // Enable pgvector
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;

    // usersTable
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role varchar(20) DEFAULT 'Patient';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'Active';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "lastActive" varchar;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "imageUrl" varchar;`;

    // aiDoctorsTable
    await sql`ALTER TABLE "aiDoctors" ALTER COLUMN "imageUrl" TYPE text;`;

    // aiDoctorKnowledgeTable
    // Drop existing fk if any and add new one
    try {
      await sql`ALTER TABLE "aiDoctorKnowledge" DROP CONSTRAINT IF EXISTS "aiDoctorKnowledge_doctorId_aiDoctors_id_fk";`;
    } catch(e) {}
    try {
      await sql`ALTER TABLE "aiDoctorKnowledge" ADD CONSTRAINT "aiDoctorKnowledge_doctorId_aiDoctors_id_fk" FOREIGN KEY ("doctorId") REFERENCES "aiDoctors"("id") ON DELETE CASCADE;`;
    } catch(e) {}
    
    // sessionsChatTable
    await sql`ALTER TABLE "sessionsChatTable" ADD COLUMN IF NOT EXISTS status varchar DEFAULT 'Pending';`;

    // notificationsTable
    await sql`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "userId" varchar NOT NULL,
        "title" varchar NOT NULL,
        "message" text NOT NULL,
        "type" varchar DEFAULT 'info',
        "read" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT now()
      );
    `;

    console.log('Schema changes applied successfully.');
  } catch (err) {
    console.error('Error applying schema changes:', err);
  }

  process.exit(0);
}

main();
