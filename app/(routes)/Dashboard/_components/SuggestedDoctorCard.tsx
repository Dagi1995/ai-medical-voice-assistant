import React from "react";
import Image from "next/image";
import { doctorAgent } from "./DoctorAgentCard";

type Props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: (doctor: doctorAgent) => void;
  selectedDoctor: doctorAgent | null;
};

function SuggestedDoctorCard({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center border rounded-2xl shadow hover:shadow-lime-600 cursor-pointer p-4 transition ${
        selectedDoctor?.id === doctorAgent.id
          ? "border-lime-600"
          : "border-transparent"
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)} // now it properly sets state
    >
      {doctorAgent.image && (
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialty || "Doctor image"}
          width={70}
          height={70}
          className="w-[50px] h-[50px] object-cover rounded-full mb-2"
        />
      )}

      <h2 className="font-bold text-sm text-center">{doctorAgent.specialty}</h2>
      <p className="text-xs text-center">{doctorAgent.description}</p>
    </div>
  );
}

export default SuggestedDoctorCard;
