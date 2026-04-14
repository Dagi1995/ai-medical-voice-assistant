import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { sessionsChatTable } from '@/config/schema';
import { eq, sql } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;
    const body = await request.json();
    const numericId = parseInt(identifier);
    
    console.log('Updating appointment:', identifier, body);

    // Update by ID or sessionId
    const updated = await db.update(sessionsChatTable)
      .set({
        ...body,
        // Ensure we don't accidentally overwrite the ID
        id: undefined 
      })
      .where(
        isNaN(numericId) 
          ? eq(sessionsChatTable.sessionId, identifier)
          : eq(sessionsChatTable.id, numericId)
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Trigger real-time update
    await db.execute(sql`NOTIFY appointment_update`);

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment', details: error.message }, { status: 500 });
  }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: identifier } = await params;
        const numericId = parseInt(identifier);

        const appointment = await db.select()
            .from(sessionsChatTable)
            .where(
                isNaN(numericId) 
                  ? eq(sessionsChatTable.sessionId, identifier)
                  : eq(sessionsChatTable.id, numericId)
            )
            .limit(1);

        if (appointment.length === 0) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        return NextResponse.json(appointment[0]);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
    }
}
