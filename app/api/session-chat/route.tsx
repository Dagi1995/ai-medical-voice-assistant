import { db } from "@/config/db";
import { sessionsChatTable, notificationsTable } from "@/config/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const sessionId = uuidv4();

    const result = await db
      .insert(sessionsChatTable)
      .values({
        sessionId,
        createdBy: userEmail,
        notes,
        selectedDoctor,
        createdOn: new Date().toISOString(),
      })
      .returning();

    // Create notification
    if (userEmail) {
      await db.insert(notificationsTable).values({
        userId: userEmail,
        title: 'Appointment Created',
        message: 'Your appointment has been successfully created.',
        type: 'success',
      });
      await db.execute(sql`NOTIFY notification_update`);
    }

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

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (sessionId == "all") {
      const result = await db
        .select()
        .from(sessionsChatTable)
        .where(
          eq(
            sessionsChatTable.createdBy,
            userEmail as string
          )
        )
        .orderBy(desc(sessionsChatTable.id));

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
