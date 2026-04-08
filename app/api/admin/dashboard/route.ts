import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating fetching data from a database or external service
  return NextResponse.json({
    totalUsers: "12,450",
    activeAppointments: "342",
    aiInteractions: "84.2K",
    systemHealth: "99.9%",
    usageData: [
      { name: 'Mon', queries: 4000, users: 2400 },
      { name: 'Tue', queries: 3000, users: 1398 },
      { name: 'Wed', queries: 2000, users: 9800 },
      { name: 'Thu', queries: 2780, users: 3908 },
      { name: 'Fri', queries: 1890, users: 4800 },
      { name: 'Sat', queries: 2390, users: 3800 },
      { name: 'Sun', queries: 3490, users: 4300 },
    ],
    symptomData: [
      { symptom: 'Headache', count: 450 },
      { symptom: 'Fever', count: 380 },
      { symptom: 'Cough', count: 320 },
      { symptom: 'Fatigue', count: 210 },
      { symptom: 'Nausea', count: 150 },
    ]
  });
}
