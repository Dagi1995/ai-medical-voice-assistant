import React from "react";
import { doctorAgent } from "./DoctorAgentCard";
import Image from "next/image";

type Props = {
  doctorAgent: doctorAgent;
};

function SuggestedDoctorCard({ doctorAgent }: Props) {
  return (
    <div className="flex flex-col items-center border rounded-2xl shadow ">
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
