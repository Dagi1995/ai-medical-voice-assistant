import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { ssl: 'require' });

async function reset() {
  try {
    await sql`DROP SCHEMA public CASCADE;`;
    await sql`CREATE SCHEMA public;`;
    await sql`GRANT ALL ON SCHEMA public TO public;`;
    console.log("Database reset!");
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
}
reset();
