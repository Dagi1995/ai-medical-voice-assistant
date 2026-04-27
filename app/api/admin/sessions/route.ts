import { db } from "@/config/db";
import { sessionsChatTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  
  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress || ""))
    .limit(1);
    
  return dbUser[0]?.role === "Admin";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await db
      .select()
      .from(sessionsChatTable)
      .orderBy(desc(sessionsChatTable.id));
      
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
