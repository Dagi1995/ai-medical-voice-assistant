import 'dotenv/config';
import { db } from "../config/db";
import { aiDoctorsTable } from "../config/schema";
import { desc, eq, and, ne } from "drizzle-orm";

async function cleanup() {
  try {
    console.log("Cleaning up duplicate doctors...");

    const allDoctors = await db.select().from(aiDoctorsTable).orderBy(desc(aiDoctorsTable.id));
    const seen = new Set();
    const toDelete = [];

    for (const doc of allDoctors) {
      const key = `${doc.name}-${doc.specialty}`;
      if (seen.has(key)) {
        toDelete.push(doc.id);
      } else {
        seen.add(key);
      }
    }

    console.log(`Found ${toDelete.length} duplicates to remove.`);

    for (const id of toDelete) {
      console.log(`Deleting duplicate doctor ID: ${id}...`);
      await db.delete(aiDoctorsTable).where(eq(aiDoctorsTable.id, id));
    }

    console.log("Cleanup completed successfully!");
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

cleanup();
