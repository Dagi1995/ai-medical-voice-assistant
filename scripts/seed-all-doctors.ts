import 'dotenv/config';
import { db } from "../config/db";
import { aiDoctorsTable } from "../config/schema";
import { AIDoctorAgents } from "../app/shared/list";

async function seed() {
  try {
    console.log("Seeding all doctors from list.tsx...");

    for (const doctor of AIDoctorAgents) {
      console.log(`Seeding ${doctor.specialty}...`);
      await db.insert(aiDoctorsTable).values({
        name: `Dr. ${doctor.specialty}`,
        specialty: doctor.specialty,
        description: doctor.description,
        agentPrompt: doctor.agentPrompt,
        voiceId: doctor.voiceId,
        imageUrl: doctor.image,
        hasRag: false,
        createdOn: new Date().toISOString(),
      });
    }

    console.log("All doctors seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();
