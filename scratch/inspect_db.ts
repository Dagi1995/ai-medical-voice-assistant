
import "dotenv/config";
import { db } from '../config/db';
import { usersTable, sessionsChatTable, aiDoctorsTable } from '../config/schema';
import { count, desc, sql } from 'drizzle-orm';

async function inspect() {
  const userCount = await db.select({ value: count() }).from(usersTable);
  const doctorCount = await db.select({ value: count() }).from(aiDoctorsTable);
  const sessionCount = await db.select({ value: count() }).from(sessionsChatTable);

  console.log('User Count:', userCount[0].value);
  console.log('Doctor Count:', doctorCount[0].value);
  console.log('Session Count:', sessionCount[0].value);

  const recentUsers = await db.select().from(usersTable).orderBy(desc(usersTable.id)).limit(5);
  console.log('Recent Users:', JSON.stringify(recentUsers, null, 2));

  const sessionsWithReports = await db.select().from(sessionsChatTable).where(sql`${sessionsChatTable.report} IS NOT NULL`).limit(5);
  console.log('Sessions with Reports:', JSON.stringify(sessionsWithReports, null, 2));
}

inspect().catch(console.error);
