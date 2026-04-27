import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function enableVector() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    console.log("Enabling pgvector extension...");
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log("Success! pgvector is now enabled.");
  } catch (error) {
    console.error("Failed to enable pgvector:", error);
  }
}

enableVector();
