import { db } from "@/config/db";
import { aiDoctorsTable, aiDoctorKnowledgeTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  
  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress || ""))
    .limit(1);
    
  return dbUser[0]?.role === "Admin";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single doctor details
      const doctor = await db.query.aiDoctorsTable.findFirst({
        where: eq(aiDoctorsTable.id, parseInt(id)),
      });

      if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

      // Fetch knowledge chunks
      const knowledge = await db
        .select()
        .from(aiDoctorKnowledgeTable)
        .where(eq(aiDoctorKnowledgeTable.doctorId, parseInt(id)));

      return NextResponse.json({ ...doctor, knowledge });
    }

    const doctors = await db
      .select()
      .from(aiDoctorsTable)
      .orderBy(desc(aiDoctorsTable.id));
      
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;
    const description = formData.get("description") as string;
    const agentPrompt = formData.get("agentPrompt") as string;
    const voiceId = formData.get("voiceId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const file = formData.get("knowledgeFile") as File | null;

    // 1. Create Doctor entry
    const doctorResult = await db
      .insert(aiDoctorsTable)
      .values({
        name,
        specialty,
        description,
        agentPrompt,
        voiceId,
        imageUrl,
        hasRag: !!file,
        createdOn: new Date().toISOString(),
      })
      .returning();

    const newDoctor = doctorResult[0];

    // 2. Process knowledge file if provided
    if (file && newDoctor) {
      const text = await file.text(); // Simple text for now, could use pdf-parse for PDFs
      
      // Split text into chunks (naive approach for now)
      const chunks = text.match(/[\s\S]{1,1000}/g) || [];
      
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

      for (const chunk of chunks) {
        const result = await model.embedContent(chunk);
        const embedding = result.embedding.values;

        await db.insert(aiDoctorKnowledgeTable).values({
          doctorId: newDoctor.id,
          content: chunk,
          embedding: embedding,
        });
      }
    }

    return NextResponse.json(newDoctor);
  } catch (error) {
    console.error("Failed to create AI doctor:", error);
    return NextResponse.json({ error: "Failed to create AI doctor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    // Delete knowledge first
    await db.delete(aiDoctorKnowledgeTable).where(eq(aiDoctorKnowledgeTable.doctorId, parseInt(id)));
    
    // Delete doctor
    await db.delete(aiDoctorsTable).where(eq(aiDoctorsTable.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete doctor:", error);
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
