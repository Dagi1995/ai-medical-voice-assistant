import { db } from "@/config/db";
import { aiDoctorsTable } from "@/config/schema";
import { desc } from "drizzle-orm";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

async function DoctorsAgentLIst() {
  const doctors = await db
    .select()
    .from(aiDoctorsTable)
    .orderBy(desc(aiDoctorsTable.id));

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-center mb-6">
        AI Specialist Doctors Agent
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor, index) => (
          <DoctorAgentCard
            key={index}
            doctorAgent={{
              ...doctor,
              image: doctor.imageUrl || "/doctor1.png",
              specialty: doctor.specialty ?? "",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentLIst;
