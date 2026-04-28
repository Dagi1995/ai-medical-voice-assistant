import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { notificationsTable } from '@/config/schema';
import { eq, sql } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;
    const numericId = parseInt(identifier);
    
    if (isNaN(numericId)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updated = await db.update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.id, numericId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Trigger explicit NOTIFY for real-time update
    await db.execute(sql`NOTIFY notification_update`);

    return NextResponse.json({ message: 'Notification marked as read', data: updated[0] });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
