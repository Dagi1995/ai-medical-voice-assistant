import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { notificationsTable } from '@/config/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('userId');

    let query = db.select().from(notificationsTable).orderBy(desc(notificationsTable.id));

    // If userId is provided in query, or we use the logged-in user's email
    // For admin dashboard, maybe we want all? We'll allow fetching all if no filter
    if (filterUserId) {
        query = db.select().from(notificationsTable).where(eq(notificationsTable.userId, filterUserId)).orderBy(desc(notificationsTable.id)) as any;
    } else if (user) {
        const userEmail = user.primaryEmailAddress?.emailAddress;
        // If admin, we could skip filtering, but let's default to user's email if no explicit filter
        if (userEmail) {
            query = db.select().from(notificationsTable).where(eq(notificationsTable.userId, userEmail)).orderBy(desc(notificationsTable.id)) as any;
        }
    }

    const notifications = await query;
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.delete(notificationsTable).where(eq(notificationsTable.userId, userEmail));
    
    // Trigger update
    await db.execute(sql`NOTIFY notification_update`);

    return NextResponse.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
  }
}
