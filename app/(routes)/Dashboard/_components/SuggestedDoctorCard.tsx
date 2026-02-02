import React from "react";
import { doctorAgent } from "./DoctorAgentCard";
import Image from "next/image";
import { sessionsChatTable } from "../../../../config/schema";

type Props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: any;
  selectedDoctor: doctorAgent;
};

function SuggestedDoctorCard({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: Props) {
  return (
    <div
className={`flex flex-col items-center border rounded-2xl shadow hover:shadow-lime-600 cursor-pointer ${
  selectedDoctor?.id === doctorAgent.id ? "border-lime-600" : ""
}`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialty || "Doctor image"}
        width={70}
        height={70}
        className="w-[50px] h-[50px] object-cover rounded-full"
      />
      <h2 className="font-bold text-sm text-center">{doctorAgent.specialty}</h2>
      <p className="text-xs text-center">{doctorAgent.description}</p>
    </div>
  );
}

export default SuggestedDoctorCard;
