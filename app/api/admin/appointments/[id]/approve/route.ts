import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { sessionsChatTable, notificationsTable } from '@/config/schema';
import { eq, sql } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;
    const numericId = parseInt(identifier);
    
    console.log('Attempting to approve appointment:', identifier);

    // Update by ID or sessionId
    const updated = await db.update(sessionsChatTable)
      .set({ status: 'Approved' })
      .where(
        isNaN(numericId) 
          ? eq(sessionsChatTable.sessionId, identifier)
          : eq(sessionsChatTable.id, numericId)
      )
      .returning();

    if (updated.length === 0) {
      console.warn('Appointment not found for identifier:', identifier);
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const updatedAppointment = updated[0];

    // Create notification
    if (updatedAppointment.createdBy) {
      await db.insert(notificationsTable).values({
        userId: updatedAppointment.createdBy,
        title: 'Appointment Approved',
        message: 'Your appointment has been approved.',
        type: 'success',
      });
      await db.execute(sql`NOTIFY notification_update`);
    }

    // Trigger explicit NOTIFY for real-time update
    await db.execute(sql`NOTIFY appointment_update`);

    return NextResponse.json({ message: 'Appointment approved successfully', data: updatedAppointment });
  } catch (error) {
    console.error('Error approving appointment:', error);
    return NextResponse.json({ error: 'Failed to approve appointment' }, { status: 500 });
  }
}
