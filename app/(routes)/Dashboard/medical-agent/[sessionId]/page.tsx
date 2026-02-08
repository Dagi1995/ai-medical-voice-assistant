"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Languages, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();

  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(
    null
  );
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      if (result?.data) setSessionDetail(result.data);
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      setSessionDetail(null);
    }
  };

  const StartCall = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I'm your AI medical assistant. I'm here to help you with any health-related questions or concerns you may have. How can I assist you today?",
      transcriber: {
        provider: "assembly-ai",
        Language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail?.selectedDoctor?.VoiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              sessionDetail?.selectedDoctor?.agentPrompt ||
              "You are a helpful and precise medical assistant for patients. Always try to answer as concisely as possible. If you don't know the answer, say you don't know. Always use all the information from the patient to answer. If the patient provides some information about their symptoms or condition, ask relevant follow-up questions to gather more details before providing a response.",
          },
        ],
      },
    };
    // @ts-ignore
    vapi.start(VapiAgentConfig);

    // ✅ Call lifecycle events
    vapi.on("call-start", () => setCallStarted(true));
    vapi.on("call-end", () => setCallStarted(false));

    // ✅ Message safely
    vapi.on("message", (message: any) => {
      if (!message || message.type !== "transcript") return;

      const { role, transcriptType, transcript } = message;
      if (!role || !transcript) return;

      if (transcriptType === "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === "final") {
        setMessages((prev) => [...prev, { role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRole(null);
      }
    });

    vapi.on("speech-start", () => setCurrentRole("assistant"));
    vapi.on("speech-end", () => setCurrentRole("user"));
  };

  const endCall = async () => {
    setLoading(true);
    if (!vapiInstance) return;

    try {
      vapiInstance.stop(); // Stops call
      // Clean up listeners
      vapiInstance.off("call-start");
      vapiInstance.off("call-end");
      vapiInstance.off("message");
      vapiInstance.off("speech-start");
      vapiInstance.off("speech-end");
    } catch (error) {
      console.warn("Error stopping Vapi call:", error);
    }

    setCallStarted(false);
    setVapiInstance(null);
    toast.success("Your report is generated");

    route.replace("/dashboard");

    const result = await GenerateReport();
    setLoading(false);
  };

  const GenerateReport = async () => {
    setLoading(true);
    const result = await axios.post("/api/medical-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
    });

    console.log(result.data);
    return result.data;
  };
  return (
    <div className="p-10 border rounded-3xl">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {/* Doctor image */}
      {sessionDetail?.selectedDoctor?.image ? (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={sessionDetail.selectedDoctor.specialty || "Doctor image"}
            width={80}
            height={80}
            className="w-[80px] h-[80px] object-cover rounded-full mt-4"
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-gray-100 rounded-full mt-10" />
      )}

      <div className="items-center justify-between flex-col flex mt-4">
        <h2 className="text-lg font-semibold mt-4">
          {sessionDetail?.selectedDoctor?.specialty || "General Physician"}
        </h2>
        <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

        {/* Messages */}
        <div className="mt-12 max-h-[300px] overflow-y-auto flex flex-col gap-3 px-4 md:px-20 lg:px-40 xl:px-56">
          {messages.slice(-6).map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "assistant"
                  ? "self-start bg-blue-50 text-blue-900"
                  : "self-end bg-green-50 text-green-900"
              }`}
            >
              <p className="font-medium mb-1 capitalize opacity-70">
                {msg.role}
              </p>
              <p>{msg.text}</p>
            </div>
          ))}

          {liveTranscript && (
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm italic animate-pulse ${
                currentRole === "assistant"
                  ? "self-start bg-blue-100 text-blue-900"
                  : "self-end bg-green-100 text-green-900"
              }`}
            >
              <p className="font-medium mb-1 opacity-70">
                {currentRole === "assistant"
                  ? "Assistant (speaking)"
                  : "You (speaking)"}
              </p>
              <p>{liveTranscript}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!callStarted ? (
          <Button className="mt-20" onClick={StartCall}>
            {loading ? <Loader className="animate-spin" /> : <PhoneCall />}{" "}
            Start Call
          </Button>
        ) : (
          <Button variant="destructive" onClick={endCall}>
            {loading ? <Loader className="animate-spin" /> : <PhoneOff />}
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
