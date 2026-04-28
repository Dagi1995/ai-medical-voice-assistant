import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { sessionsChatTable } from '@/config/schema';
import { desc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Self-healing: Ensure status column exists
    try {
      await db.execute(sql`ALTER TABLE "sessionsChatTable" ADD COLUMN IF NOT EXISTS "status" VARCHAR DEFAULT 'Pending'`);
    } catch (e) {
      // Column probably exists, ignore
    }

    const appointments = await db.select().from(sessionsChatTable).orderBy(desc(sessionsChatTable.id));
    console.log('Fetched Appointments:', appointments.slice(0, 2)); // Log first 2 for debugging
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientName, doctorName, notes, language } = body;

    console.log('Attempting to create appointment for:', patientName);

    let newAppointment;
    try {
      // Attempt 1: Try to set createdBy (might fail if patientName is not a registered email)
      newAppointment = await db.insert(sessionsChatTable).values({
        sessionId: Math.random().toString(36).substring(7),
        createdBy: patientName, 
        selectedDoctor: { name: doctorName },
        notes: notes,
        language: language || "English",
        createdOn: new Date().toISOString(),
      }).returning();
    } catch (insertError: any) {
      console.warn('Foreign key constraint likely failed for createdBy. Retrying without it:', insertError.message);
      
      // Attempt 2: Insert without createdBy if the first attempt failed (probably FK constraint)
      newAppointment = await db.insert(sessionsChatTable).values({
        sessionId: Math.random().toString(36).substring(7),
        selectedDoctor: { name: doctorName },
        notes: `[Patient: ${patientName}] ${notes}`, // Preserve the patient name in notes
        language: language || "English",
        createdOn: new Date().toISOString(),
      }).returning();
      
      // Store the patient name in the notes or somewhere else if needed, 
      // but for display we can update the local session or just accept the fallback.
      console.log('Appointment created as Unregistered Patient');
    }

    // Trigger explicit NOTIFY for the real-time listener
    await db.execute(sql`NOTIFY appointment_update`);

    return NextResponse.json(newAppointment[0]);
  } catch (error: any) {
    console.error('Final Error creating appointment:', error);
    return NextResponse.json({ 
      error: 'Failed to create appointment',
      details: error.message 
    }, { status: 500 });
  }
}
