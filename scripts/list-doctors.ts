import 'dotenv/config';
import { db } from "../config/db";
import { aiDoctorsTable } from "../config/schema";

async function listDoctors() {
  try {
    const doctors = await db.select().from(aiDoctorsTable);
    
    if (doctors.length === 0) {
      console.log("No doctors found in the database.");
      return;
    }

    console.log("\n--- Registered AI Doctors ---");
    console.table(doctors.map(d => ({
      ID: d.id,
      Name: d.name,
      Specialty: d.specialty,
      RAG: d.hasRag ? "Yes" : "No",
      Voice: d.voiceId
    })));
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
  }
}

listDoctors();
