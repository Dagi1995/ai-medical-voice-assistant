import 'dotenv/config';
import { db } from "../config/db";
import { aiDoctorsTable, aiDoctorKnowledgeTable } from "../config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function seed() {
  try {
    console.log("Seeding General Physician from text file...");

    // 1. Create the doctor
    const doctorResult = await db.insert(aiDoctorsTable).values({
      name: "Dr. Alex (General Physician)",
      specialty: "General Physician",
      description: "Helps with everyday health concerns and common symptoms.",
      agentPrompt: "You are a friendly General Physician speaking to a patient. Start with a warm greeting, then calmly ask what symptoms or health problems they are experiencing today. Keep your responses short, clear, and supportive, and ask only one simple follow-up question at a time.",
      voiceId: "andrew",
      imageUrl: "/doctor1.png",
      hasRag: true,
      createdOn: new Date().toISOString(),
    }).returning();

    const doctor = doctorResult[0];
    console.log("Doctor created:", doctor.id);

    // 2. Read the text file
    const filePath = path.join(process.cwd(), 'file', 'ai_doctor_rag_dataset.txt');
    const text = fs.readFileSync(filePath, 'utf-8');

    // 3. Process knowledge (chunking)
    const chunks = text.match(/[\s\S]{1,1000}/g) || [];
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    for (const chunk of chunks) {
      console.log("Embedding chunk of length", chunk.length);
      const result = await model.embedContent(chunk);
      const embedding = result.embedding.values;

      await db.insert(aiDoctorKnowledgeTable).values({
        doctorId: doctor.id,
        content: chunk,
        embedding: embedding,
      });
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();
