import "dotenv/config";
import { db } from "../lib/db";
import { usersTable } from "../config/schema";

async function verify() {
  try {
    const users = await db.select().from(usersTable).limit(1);
    console.log("Connection successful! Tables exist.");
    console.log("Sample query result (users):", users);
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verify();
