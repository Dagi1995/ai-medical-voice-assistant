import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export type doctorAgent = {
  id: number;
  specialty: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
};

type Props = {
  doctorAgent: doctorAgent;
};

function DoctorAgentCard({ doctorAgent }: Props) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialty || "Doctor image"}
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-full"
      />
      <h2 className="font-semibold text-lg mt-2">{doctorAgent.specialty}</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        {doctorAgent.description}
      </p>
      <Button className="mt-4 w-full sm:w-auto px-6">Start Consultation</Button>
    </div>
  );
}

export default DoctorAgentCard;
