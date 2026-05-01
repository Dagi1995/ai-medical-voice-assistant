import { db } from "../config/db";
import { sessionsChatTable } from "../config/schema";
import { desc } from "drizzle-orm";

async function main() {
  const sessions = await db
    .select()
    .from(sessionsChatTable)
    .orderBy(desc(sessionsChatTable.id))
    .limit(1);

  if (sessions.length > 0) {
    console.log("Latest Session ID:", sessions[0].sessionId);
    console.log("Report:", JSON.stringify(sessions[0].report, null, 2));
  } else {
    console.log("No sessions found.");
  }
}

main().catch(console.error);
