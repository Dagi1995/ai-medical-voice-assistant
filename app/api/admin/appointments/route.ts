import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { sessionsChatTable } from '@/config/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const appointments = await db.select().from(sessionsChatTable).orderBy(desc(sessionsChatTable.id));
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
