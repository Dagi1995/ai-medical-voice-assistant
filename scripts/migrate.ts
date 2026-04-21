import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../lib/db";

async function runMigration() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
