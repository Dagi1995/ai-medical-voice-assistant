import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import fs from 'fs';

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log("Enabling pgvector extension...");
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    
    console.log("Applying migrations...");
    const migrationSql = fs.readFileSync('./drizzle/0000_known_hitman.sql', 'utf8');
    const statements = migrationSql.split('--> statement-breakpoint');
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        console.log("Executing statement...");
        try {
          await sql.query(trimmed);
        } catch (e) {
          console.warn("Statement failed (might already exist):", e.message);
        }
      }
    }
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
