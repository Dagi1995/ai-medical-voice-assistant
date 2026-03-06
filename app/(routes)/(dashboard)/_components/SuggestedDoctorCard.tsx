"use client";

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
  const isSelected = selectedDoctor?.id === doctorAgent.id;

  return (
    <div
      className={`flex flex-col items-center border rounded-2xl shadow hover:shadow-lg cursor-pointer p-4 transition-colors duration-200
        ${isSelected ? "border-lime-500 dark:border-lime-400" : "border-gray-200 dark:border-gray-600"}
        bg-white dark:bg-gray-800
      `}
      onClick={() => setSelectedDoctor(doctorAgent)}
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

      <h2 className="font-bold text-sm text-center text-gray-900 dark:text-gray-100">
        {doctorAgent.specialty}
      </h2>
      <p className="text-xs text-center text-gray-600 dark:text-gray-300">
        {doctorAgent.description}
      </p>
    </div>
  );
}

export default SuggestedDoctorCard;
