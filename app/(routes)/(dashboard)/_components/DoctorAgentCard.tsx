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
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialty || "Doctor image"}
          width={80}
          height={80}
          className="relative w-24 h-24 object-cover rounded-full border-2 border-white dark:border-slate-800 shadow-md"
        />
      </div>
      <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">{doctorAgent.specialty}</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
        {doctorAgent.description}
      </p>
      <Button 
        variant={"default"} 
        className="mt-6 w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02] shadow-md transition-all"
      >
        Start Consultation
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
