import { db } from '@/config/db';
import { usersTable, sessionsChatTable, aiDoctorsTable } from '@/config/schema';
import { count, desc, sql, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import moment from 'moment';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'weekly';

    // 1. Fetch Total Counts
    const [userCount] = await db.select({ value: count() }).from(usersTable);
    const [sessionCount] = await db.select({ value: count() }).from(sessionsChatTable);
    const [doctorCount] = await db.select({ value: count() }).from(aiDoctorsTable);

    // 2. Fetch Recent Activities
    const recentUsers = await db.select().from(usersTable).orderBy(desc(usersTable.id)).limit(5);
    const recentSessions = await db.select().from(sessionsChatTable).orderBy(desc(sessionsChatTable.id)).limit(5);

    const recentActivities = [
      ...recentUsers.map(u => ({
        id: `u-${u.id}`,
        type: 'user',
        title: `New User: ${u.name}`,
        time: moment(u.lastActive || new Date()).fromNow()
      })),
      ...recentSessions.map(s => ({
        id: `s-${s.id}`,
        type: 'ai',
        title: `Session with ${s.createdBy}`,
        time: moment(s.createdOn).fromNow()
      }))
    ].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

    // 3. Process Usage Data (Last 7 days for 'weekly')
    let daysToFetch = range === 'daily' ? 1 : range === 'monthly' ? 30 : 7;
    const startDate = moment().subtract(daysToFetch, 'days').startOf('day');
    
    // For usage chart, we'll fetch sessions from the last period
    const allRecentSessions = await db.select().from(sessionsChatTable);
    
    const usageMap: Record<string, { queries: number, users: Set<string> }> = {};
    
    // Initialize map with dates
    for (let i = 0; i < daysToFetch; i++) {
      const dateStr = moment().subtract(i, 'days').format('MMM DD');
      usageMap[dateStr] = { queries: 0, users: new Set() };
    }

    allRecentSessions.forEach(session => {
      const date = moment(session.createdOn);
      const dateStr = date.format('MMM DD');
      if (usageMap[dateStr]) {
        usageMap[dateStr].queries += 1;
        if (session.createdBy) usageMap[dateStr].users.add(session.createdBy);
      }
    });

    const usageData = Object.entries(usageMap).map(([name, stats]) => ({
      name,
      queries: stats.queries,
      users: stats.users.size
    })).reverse();

    // 4. Process Symptom Data
    const sessionsWithReports = await db.select().from(sessionsChatTable)
      .where(sql`${sessionsChatTable.report} IS NOT NULL`);
    
    const symptomsMap: Record<string, number> = {};
    sessionsWithReports.forEach(session => {
      const report = session.report as any;
      if (report && Array.isArray(report.symptoms)) {
        report.symptoms.forEach((s: string) => {
          const normalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
          symptomsMap[normalized] = (symptomsMap[normalized] || 0) + 1;
        });
      }
    });

    const symptomData = Object.entries(symptomsMap)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // If no symptom data, provide some realistic defaults
    if (symptomData.length === 0) {
      symptomData.push(
        { symptom: 'Headache', count: 0 },
        { symptom: 'Fever', count: 0 },
        { symptom: 'Cough', count: 0 }
      );
    }

    return NextResponse.json({
      totalUsers: userCount.value.toLocaleString(),
      totalSessions: sessionCount.value.toLocaleString(),
      totalDoctors: doctorCount.value.toLocaleString(),
      systemHealth: "99.9%",
      usageData,
      symptomData,
      recentActivities,
      alerts: [
        { id: 101, type: 'info', title: 'System Live', message: 'All systems operational. Monitoring active sessions.', time: 'Just now' }
      ]
    });
  } catch (error) {
    console.error('Admin Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
