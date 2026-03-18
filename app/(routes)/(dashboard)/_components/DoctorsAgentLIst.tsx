import { AIDoctorAgents } from "@/app/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";


function DoctorsAgentLIst() {
  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-center mb-6">
        AI Specialist Doctors Agent
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {AIDoctorAgents.map((doctor, index) => (
          <DoctorAgentCard
            key={index}
            doctorAgent={{
              ...doctor,
              specialty: doctor.specialty ?? "",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentLIst;
