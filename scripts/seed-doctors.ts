import 'dotenv/config';
import { db } from "../config/db";
import { aiDoctorsTable, aiDoctorKnowledgeTable, usersTable } from "../config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";

// Note: Ensure you have db.mjs and schema.mjs if running with pure node
// Or use tsx to run the original files.
// For simplicity, I'll assume the environment can run this.

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

async function seed() {
  try {
    console.log("Seeding Coronavirus Specialist...");

    // 1. Create the doctor
    const doctorResult = await db.insert(aiDoctorsTable).values({
      name: "Dr. Corona Expert",
      specialty: "Infectious Disease Specialist",
      description: "An AI agent specialized in COVID-19 information, safety protocols, and symptom analysis.",
      agentPrompt: "You are Dr. Corona Expert, a highly knowledgeable Infectious Disease Specialist. Your goal is to provide accurate, up-to-date information about COVID-19, including symptoms, prevention, and current CDC guidelines. Be empathetic but clinical. Always remind users to consult with a physical doctor for official diagnosis.",
      voiceId: "emma",
      hasRag: true,
      createdOn: new Date().toISOString(),
    }).returning();

    const doctor = doctorResult[0];
    console.log("Doctor created:", doctor.id);

    // 2. Add some initial knowledge
    const knowledgeBase = [
      "Common symptoms of COVID-19 include fever, cough, tiredness, and loss of taste or smell. Less common symptoms include sore throat, headache, aches and pains, diarrhea, and a rash on skin.",
      "To prevent the spread of COVID-19, maintain a safe distance from others, wear a mask in public, clean your hands often, and get vaccinated when it is your turn.",
      "If you have a fever, cough and difficulty breathing, seek medical attention early. Call by telephone first so your healthcare provider can direct you to the right health facility.",
      "The incubation period for COVID-19 (the time between exposure to the virus and symptom onset) is on average 5-6 days, but can range from 1 to 14 days.",
      "Self-isolation is recommended for individuals who have symptoms of COVID-19 or who have tested positive for the virus. Stay in a separate room and use a separate bathroom if possible."
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    for (const chunk of knowledgeBase) {
      console.log("Embedding chunk...");
      const result = await model.embedContent(chunk);
      const embedding = result.embedding.values;
      console.log(`Embedding dimension: ${embedding.length}`);

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
