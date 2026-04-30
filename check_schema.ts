import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const res = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `;
  console.log('users schema:', res);
  process.exit(0);
}

main().catch(console.error);
