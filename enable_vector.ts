import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Enabling pgvector...');
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
  console.log('pgvector enabled.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
