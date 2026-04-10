import { db } from "@/config/db";
import { sessionsChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();
    const sessionId = uuidv4();

    const result = await db
      .insert(sessionsChatTable)
      .values({
        sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes,
        selectedDoctor,
        createdOn: new Date().toISOString(),
      })
      .returning();

    // Emit real-time PostgreSQL NOTIFY trigger
    await db.execute(sql`NOTIFY appointment_update, 'appointment_changed'`);

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("Failed to create session:", e);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json(null);

    const user = await currentUser();
    if (sessionId == "all") {
      const result = await db
        .select()
        .from(sessionsChatTable)
        .where(
          //@ts-ignore
          eq(
            sessionsChatTable.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(desc(sessionsChatTable.id));

      // return the full array of sessions for the current user
      return NextResponse.json(result);
    } else {
      const result = await db
        .select()
        .from(sessionsChatTable)
        .where(eq(sessionsChatTable.sessionId, sessionId));

      return NextResponse.json(result[0] || null);
    }
  } catch (e) {
    console.error("Failed to fetch session:", e);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
