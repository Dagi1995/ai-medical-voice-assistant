import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

// Cache the database connection in development to prevent connection leaks
// during Next.js Hot Module Replacement (HMR).
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Connect to Neon with SSL and disable prepare for PgBouncer / Neon compatibility
const sql = globalForDb.conn ?? postgres(connectionString, {
  prepare: false,
  ssl: 'require',
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = sql;
}

export const db = drizzle({ client: sql });
