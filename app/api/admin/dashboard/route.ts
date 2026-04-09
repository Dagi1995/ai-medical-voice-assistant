import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'weekly';

  let usageData = [];
  if (range === 'daily') {
    usageData = [
      { name: '00:00', queries: 200, users: 120 },
      { name: '04:00', queries: 150, users: 80 },
      { name: '08:00', queries: 800, users: 600 },
      { name: '12:00', queries: 1200, users: 950 },
      { name: '16:00', queries: 1100, users: 850 },
      { name: '20:00', queries: 600, users: 400 },
    ];
  } else if (range === 'monthly') {
    usageData = [
      { name: 'Week 1', queries: 15000, users: 10000 },
      { name: 'Week 2', queries: 18000, users: 12500 },
      { name: 'Week 3', queries: 16500, users: 11000 },
      { name: 'Week 4', queries: 21000, users: 14000 },
    ];
  } else {
    usageData = [
      { name: 'Mon', queries: 4000, users: 2400 },
      { name: 'Tue', queries: 3000, users: 1398 },
      { name: 'Wed', queries: 2000, users: 9800 },
      { name: 'Thu', queries: 2780, users: 3908 },
      { name: 'Fri', queries: 1890, users: 4800 },
      { name: 'Sat', queries: 2390, users: 3800 },
      { name: 'Sun', queries: 3490, users: 4300 },
    ];
  }

  return NextResponse.json({
    totalUsers: "12,450",
    activeAppointments: "342",
    aiInteractions: "84.2K",
    systemHealth: "99.9%",
    usageData,
    symptomData: [
      { symptom: 'Headache', count: 450 },
      { symptom: 'Fever', count: 380 },
      { symptom: 'Cough', count: 320 },
      { symptom: 'Fatigue', count: 210 },
      { symptom: 'Nausea', count: 150 },
    ],
    recentActivities: [
      { id: 1, type: 'user', title: 'New User Registered: John Doe', time: '2 mins ago' },
      { id: 2, type: 'ai', title: 'AI completed symptom analysis for Patient #1024', time: '15 mins ago' },
      { id: 3, type: 'appointment', title: 'Appointment updated by Dr. Smith', time: '1 hour ago' },
      { id: 4, type: 'user', title: 'New User Registered: Jane Roe', time: '2 hours ago' },
      { id: 5, type: 'system', title: 'System health check completed successfully', time: '3 hours ago' },
    ]
  });
}
