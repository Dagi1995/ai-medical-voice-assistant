import { AIDoctorAgents } from "@/app/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

function DoctorsAgentLIst() {
  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl  flex item-center justify-center">
        AI Spacialist Doctors Agent
      </h2>

      <div>
        {AIDoctorAgents.map((doctor, index) => (
          <div
            key={index}
            className="border  p-4 rounded-lg mt-4 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <DoctorAgentCard
              doctorAgent={{
                ...doctor,
                specialty: (doctor as any).specialty ?? "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentLIst;
