"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
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

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const route = useRouter();

  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(
    null
  );
  const [callStarted, setCallStarted] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ SINGLE Vapi instance
  const vapiRef = useRef<any>(null);
  const listenersRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {}
        vapiRef.current = null;
      }
    };
  }, []);

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
    if (vapiRef.current) {
      console.warn("Call already exists.");
      return;
    }

    setLoading(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    vapiRef.current = vapi;

    const config = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I'm your AI medical assistant. How can I assist you today?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "azure",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              sessionDetail?.selectedDoctor?.agentPrompt ||
              "You are a helpful and precise medical assistant.",
          },
        ],
      },
    };

    // ✅ Define listeners
    const handleCallStart = () => {
      setCallStarted(true);
      setLoading(false);
    };

    const handleCallEnd = () => {
      setCallStarted(false);
    };

    const handleMessage = (message: any) => {
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
    };

    const handleSpeechStart = () => setCurrentRole("assistant");
    const handleSpeechEnd = () => setCurrentRole("user");

    // Attach listeners
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);

    // Save references for cleanup
    listenersRef.current = {
      handleCallStart,
      handleCallEnd,
      handleMessage,
      handleSpeechStart,
      handleSpeechEnd,
    };
    //@ts-ignore
    vapi.start(config);
  };

  const endCall = async () => {
    if (!vapiRef.current) return;

    setLoading(true);

    try {
      const vapi = vapiRef.current;

      await vapi.stop();

      const {
        handleCallStart,
        handleCallEnd,
        handleMessage,
        handleSpeechStart,
        handleSpeechEnd,
      } = listenersRef.current || {};

      if (handleCallStart) vapi.off("call-start", handleCallStart);
      if (handleCallEnd) vapi.off("call-end", handleCallEnd);
      if (handleMessage) vapi.off("message", handleMessage);
      if (handleSpeechStart) vapi.off("speech-start", handleSpeechStart);
      if (handleSpeechEnd) vapi.off("speech-end", handleSpeechEnd);

      vapiRef.current = null;
      listenersRef.current = null;
    } catch (error) {
      console.warn("Error stopping Vapi call:", error);
    }

    setCallStarted(false);
    toast.success("Your report is generated");

    await GenerateReport();

    setLoading(false);
    route.replace("/dashboard");
  };

  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages,
      sessionDetail,
      sessionId,
    });

    return result.data;
  };

  return (
    <div className="p-10 border rounded-3xl">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

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

        <div className="mt-12 max-h-[300px] overflow-y-auto flex flex-col gap-3 px-4 md:px-20 lg:px-40 xl:px-56">
          {messages.slice(-6).map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
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
            {loading ? <Loader className="animate-spin" /> : <PhoneCall />}
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
