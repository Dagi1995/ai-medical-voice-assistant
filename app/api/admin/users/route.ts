import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.id));
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
