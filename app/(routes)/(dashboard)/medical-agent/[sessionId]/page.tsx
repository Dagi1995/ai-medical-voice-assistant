"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddisRealtime } from "../../../../../hook/useAddisRealtime";
import { MedicalLibrary } from "../../../../../lib/medical/library";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  conversation?: string | any[];
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
  const [recognition, setRecognition] = useState<any>(null);
  const [timer, setTimer] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook instance with dynamic prompt
  const sysPrompt = 
    (sessionDetail?.selectedDoctor?.agentPrompt || "You are a helpful and precise medical assistant.") +
    "\\n[SYSTEM RULE]: You are an AI Medical Assistant talking directly to the user over voice. Be human-like, helpful, empathetic, and always respond in Amharic. If system knowledge injections occur, use them organically to guide the patient without acting like a robot reading facts.";

  const {
    isConnected,
    isStreaming,
    startRealtime,
    stopRealtime,
    playGreeting,
    sendTextMessage,
  } = useAddisRealtime({
    apiKey: process.env.NEXT_PUBLIC_ADDIS_API_KEY || "YOUR_FALLBACK_KEY",
    systemInstructions: sysPrompt,
    onMessage: (role, content) => {
      setMessages((prev) => [...prev, { role, text: content }]);
      setCurrentRole(role);
      setLiveTranscript(""); // clear user partial transcript if ai answers
    },
    onGreetingStart: () => setCurrentRole("assistant"),
    onGreetingEnd: () => setCurrentRole(null),
    onError: (err: any) => {
      // Ignore normal websocket disconnect empty Event objects
      if (err instanceof Event || (typeof err === "object" && !err.message)) {
        return;
      }
      console.error(err);
      toast.error("Realtime Voice Error detected.");
    },
  });

  // Speech Recognition mapping
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const sr = new SpeechRecognition();
        sr.continuous = true;
        sr.interimResults = true;
        sr.lang = "am-ET";
        sr.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }
          if (finalTranscript) {
            setMessages((prev) => [
              ...prev,
              { role: "user", text: finalTranscript },
            ]);
            handleRAG(finalTranscript);
          }
          
          setLiveTranscript(finalTranscript ? "" : interimTranscript);
          setCurrentRole("user");
        };
        sr.onerror = (e: any) => console.log("Speech Error", e);
        setRecognition(sr);
      }
    }
  }, []);

  const handleRAG = (transcript: string) => {
    let ragInjection = "";
    Object.entries(MedicalLibrary).forEach(([condition, data]) => {
      const { keywords, advice_am, follow_up_questions_am } = data;
      const t = transcript.toLowerCase();
      // Match if any keyword is in transcript
      if (keywords.some((k) => t.includes(k.toLowerCase()))) {
        ragInjection += `\\n[SYSTEM KNOWLEDGE INJECTION]: The user query matches symptoms for "${condition}". Use these valid medical facts: ${advice_am}. Please gracefully advise the user about this and pick one or more of these follow-up questions to ask: ${follow_up_questions_am.join(" OR ")}. Do not read this literal text, just use it to frame your knowledge in Amharic.\\n`;
      }
    });

    if (ragInjection) {
      console.log("RAG Match found, injecting silently to Assistant WS.", ragInjection);
      sendTextMessage(ragInjection);
    }
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (callStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [callStarted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected || isStreaming) {
        stopRealtime();
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isConnected, isStreaming, stopRealtime, recognition]);

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

  const StartCall = async () => {
    if (isConnected || isStreaming || callStarted) {
      console.warn("Call already exists or starting.");
      return;
    }

    setLoading(true);
    setTimer(0);

    try {
      await startRealtime();
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
            console.log("Recognition may already be running", e);
        }
      }
      setCallStarted(true);
      await playGreeting("ሰላም! እኔ የእርስዎ አርቴፊሻል ኢንተለጀንስ ዶክተር ነኝ። በምን ልርዳዎ?");
      setLoading(false);
    } catch (error) {
      console.warn("Error starting call:", error);
      setLoading(false);
    }
  };

  const endCall = async () => {
    setLoading(true);

    try {
      stopRealtime();
      if (recognition) {
        recognition.stop();
      }
    } catch (error) {
      console.warn("Error stopping call:", error);
    }

    setCallStarted(false);
    toast.success("Your report is generated");

    await GenerateReport();

    setLoading(false);
    route.replace("/home");
  };

  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages,
      sessionDetail,
      sessionId,
      callDuration: formatTime(timer),
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
        <h2 className="font-bold text-xl text-gray-400">{formatTime(timer)}</h2>
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

