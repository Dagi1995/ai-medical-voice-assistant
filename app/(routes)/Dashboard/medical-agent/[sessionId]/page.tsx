"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};
function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);
  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };
  return (
    <div className="p-10  border rounded-3xl">
      <div className=" flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4"></Circle> Not Connectedf
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetail?.selectedDoctor?.image && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={sessionDetail.selectedDoctor.specialty || "Doctor image"}
            width={80}
            height={80}
            className="w-[80px] h-[80px] object-cover rounded-full mt-4"
          />
        </div>
      )}
      <div className="items-center justify-between flex-col flex mt-4">
        <h2 className="text-lg font-semibold mt-4">
          {sessionDetail?.selectedDoctor?.specialty}
        </h2>
        <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

        <div className="mt-32">
          <h2 className="text-gray-400">Assistant msg</h2>
          <h2 className="text-lg"> User msg</h2>
        </div>
        <Button className="mt-20">
          <PhoneCall></PhoneCall> Start Call
        </Button>
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
