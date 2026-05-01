"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff, Send, Mic, MicOff, Languages, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  conversation?: any[];
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: "user" | "assistant" | "model";
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const route = useRouter();

  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [timer, setTimer] = useState(0);
  
  const [sttLanguage, setSttLanguage] = useState<"am-ET" | "en-US" | "auto">("auto");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Refs for audio, recognition, and recording
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null); // Keeping for type safety if needed elsewhere
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isComponentMounted = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false); // Ref mirror of loading state for use inside closures
  const locationRef = useRef<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
    
    // Request user location for nearby facilities feature
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationRef.current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Captured location for medical report:", locationRef.current);
        },
        (error) => {
          console.warn("Geolocation denied or unavailable:", error.message);
        }
      );
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isVoiceMode) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVoiceMode]);

  // Setup Audio Recording for STT
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Volume Meter Setup
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateLevel = () => {
        if (!isComponentMounted.current) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        if (isVoiceMode) requestAnimationFrame(updateLevel);
        else setAudioLevel(0);
      };
      updateLevel();

      // Select best supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
        ? "audio/webm;codecs=opus" 
        : MediaRecorder.isTypeSupported("audio/webm") 
          ? "audio/webm" 
          : "audio/mp4";

      console.log("Starting recorder with mimeType:", mimeType);
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log("Recording stopped. Blob size:", audioBlob.size);
        
        // Stop tracks AFTER blob is finalized
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();

        if (audioBlob.size > 500) { 
          await handleTranscribe(audioBlob);
        } else {
          console.warn("Audio blob too small, skipping transcription.");
        }
        
        // Use loadingRef (not loading state) to avoid stale closure issue
        scheduleNextRecording();
      };

      recorder.start();
      setIsRecording(true);

      // Record in 5 second chunks
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
        }
      }, 5000);

    } catch (err) {
      console.error("Recording error:", err);
      toast.error("Microphone access denied or error occurred.");
      setIsVoiceMode(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob);
      
      const res = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text && data.text.trim().length > 4) {
        console.log("Detected Speech:", data.text);
        // Show a temporary toast for user feedback
        toast.success(`Heard: "${data.text}"`, { duration: 2000 });
        
        // INTERRUPTION logic
        audioQueue.current = [];
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }
        isPlaying.current = false;
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }

        handleSendMessage(data.text);
      } else if (data.error) {
        console.warn("STT Error:", data.error);
      }
    } catch (err) {
      console.error("STT API error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Helper to schedule the next recording cycle using refs (avoids stale closures)
  const scheduleNextRecording = () => {
    if (!isComponentMounted.current) return;
    // Use refs to check actual current state
    if (loadingRef.current || isPlaying.current) {
      // AI is busy — poll every 2s until it's done
      const pollId = setInterval(() => {
        if (!isComponentMounted.current) { clearInterval(pollId); return; }
        if (!loadingRef.current && !isPlaying.current) {
          clearInterval(pollId);
          startRecording();
        }
      }, 2000);
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    isComponentMounted.current = true;
    if (isVoiceMode) {
      startRecording();
    }
    return () => {
      isComponentMounted.current = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isVoiceMode]);

  useEffect(() => {
    if (sessionDetail && messages.length === 0 && !loading) {
      handleGreeting();
    }
  }, [sessionDetail, messages]);

  const handleGreeting = async () => {
    if (!sessionDetail) return;
    setLoading(true);
    loadingRef.current = true;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "GREETING_START",
          sessionId: sessionId,
          doctorId: sessionDetail.selectedDoctor.id,
          history: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "AI is currently unavailable. Please try again.");
        return;
      }
      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      let sentenceBuffer = "";

      // Add placeholder message
      setMessages([{ role: "assistant", text: "" }]);

      let partialLine = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const content = partialLine + chunk;
        const lines = content.split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            const textChunk = data.text || "";
            if (!textChunk) continue;

            aiText += textChunk;
            sentenceBuffer += textChunk;

            // Update UI
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [...prev.slice(0, -1), { ...last, text: aiText }];
              }
              return prev;
            });

            // Incremental TTS: Trigger on punctuation
            if (/[.!?፣።]/.test(sentenceBuffer)) {
              const sentence = sentenceBuffer.trim();
              if (sentence) {
                // AWAIT ensures that sentences are added to the audio queue in the correct order
                await playTTS(sentence);
                sentenceBuffer = ""; 
              }
            }
          } catch (e) {
            console.error("Error parsing JSON line:", line, e);
          }
        }
      }
      
      // Final flush of buffer
      if (sentenceBuffer.trim()) {
        await playTTS(sentenceBuffer.trim());
      }
    } catch (error) {
      console.error("Greeting failed:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const [generatingReport, setGeneratingReport] = useState(false);

  const generateReport = async () => {
    if (messages.length < 2) {
      toast.error("Conversation is too short to generate a report.");
      return;
    }

    setGeneratingReport(true);
    try {
      const res = await axios.post("/api/report", {
        sessionId,
        messages: messages.map(m => ({
          role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
          text: m.text
        })),
        latitude: locationRef.current?.lat,
        longitude: locationRef.current?.lng,
      });

      if (res.data.success) {
        toast.success("Medical report generated and saved!");
        // Optionally redirect or show report
        route.push("/history"); // Go back to history to see the report
      }
    } catch (error: any) {
      console.error("Report failed:", error);
      toast.error("Failed to generate report: " + (error.response?.data?.error || error.message));
    } finally {
      setGeneratingReport(false);
    }
  };

  const audioQueue = useRef<{ type: "url" | "speech"; content: string }[]>([]);
  const isPlaying = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const processAudioQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0) return;

    isPlaying.current = true;
    const task = audioQueue.current.shift();

    if (!task) {
      isPlaying.current = false;
      return;
    }

    if (task.type === "url") {
      console.log("Playing AI Audio Task...");
      const audio = new Audio(task.content);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setTimeout(() => {
          isPlaying.current = false;
          currentAudioRef.current = null;
          processAudioQueue();
        }, 200); // Small pause for natural speech
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        isPlaying.current = false;
        currentAudioRef.current = null;
        processAudioQueue();
      };

      audio.play().catch(err => {
        console.error("Audio play blocked:", err);
        isPlaying.current = false;
        currentAudioRef.current = null;
        processAudioQueue();
      });
    } else if (task.type === "speech") {
      console.log("Playing Browser Speech Task...");
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(task.content);
        const voices = window.speechSynthesis.getVoices();
        
        // Detect language for browser voice
        const isAmharic = /[\u1200-\u137F]/.test(task.content);
        const voice = voices.find(v => v.lang.startsWith(isAmharic ? "am" : "en"));
        if (voice) utterance.voice = voice;
        
        utterance.onend = () => {
          setTimeout(() => {
            isPlaying.current = false;
            processAudioQueue();
          }, 200);
        };
        
        utterance.onerror = () => {
          isPlaying.current = false;
          processAudioQueue();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        isPlaying.current = false;
        processAudioQueue();
      }
    }
  };

  const playTTS = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Language Detection: Check for Ethiopic characters
    const isAmharic = /[\u1200-\u137F]/.test(cleanText);
    const langCode = isAmharic ? "am" : "en";

    console.log(`Processing TTS [${langCode}]:`, cleanText.substring(0, 50));

    try {
      // Use Hasab AI TTS via our server route (keeps API key server-side)
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          language: langCode,
          voiceId: sessionDetail?.selectedDoctor?.voiceId || (isAmharic ? "Selam" : "default"),
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const contentType = data.content_type || "audio/wav";
          const audioSrc = `data:${contentType};base64,${data.audio}`;
          audioQueue.current.push({ type: "url", content: audioSrc });
          processAudioQueue();
          return; 
        } else if (data.audio_url) {
          audioQueue.current.push({ type: "url", content: data.audio_url });
          processAudioQueue();
          return;
        }
      }
    } catch (error: any) {
      console.warn("TTS API failed, queuing browser fallback:", error.message);
    }

    // 2. Queue Browser Fallback (will play in sequence with others)
    audioQueue.current.push({ type: "speech", content: cleanText });
    processAudioQueue();
  };

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
      if (result?.data) {
        setSessionDetail(result.data);
        if (result.data.conversation && result.data.conversation.length > 0) {
          const mapped = result.data.conversation.map((m: any) => ({
            role: m.role === "model" ? "assistant" : "user",
            text: m.parts[0].text
          }));
          setMessages(mapped);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session details:", error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !sessionDetail || loading) return;

    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);
    loadingRef.current = true;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          doctorId: sessionDetail.selectedDoctor.id,
          history: messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to get response");
        return;
      }

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      let sentenceBuffer = "";

      // Add placeholder for AI response
      setMessages(prev => [...prev, { role: "assistant", text: "" }]);

      let partialLine = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const content = partialLine + chunk;
        const lines = content.split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.error) {
              toast.error(data.error);
              break;
            }
            const textChunk = data.text || "";
            if (!textChunk) continue;

            aiText += textChunk;
            sentenceBuffer += textChunk;

            // Update UI
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [...prev.slice(0, -1), { ...last, text: aiText }];
              }
              return prev;
            });

            // Trigger TTS on sentence completion
            if (/[.!?፣።]/.test(sentenceBuffer)) {
              const sentence = sentenceBuffer.trim();
              if (sentence) {
                await playTTS(sentence);
                sentenceBuffer = "";
              }
            }
          } catch (e) {
            console.error("Error parsing JSON line:", e);
          }
        }
      }

      // Final flush
      if (sentenceBuffer.trim()) {
        await playTTS(sentenceBuffer.trim());
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const toggleVoiceMode = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
      toast.success("Voice mode activated (Auto-Detecting Language)");
    } else {
      setIsVoiceMode(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      toast.info("Voice mode deactivated");
    }
  };

  const endCall = async () => {
    setLoading(true);
    loadingRef.current = true;
    if (recognitionRef.current) recognitionRef.current.stop();
    if (audioRef.current) audioRef.current.pause();

    try {
      await axios.post("/api/medical-report", {
        messages,
        sessionDetail,
        sessionId,
        callDuration: formatTime(timer),
        latitude: locationRef.current?.lat,
        longitude: locationRef.current?.lng,
      });
      toast.success("Session ended and report generated");
      route.replace("/home");
    } catch (error) {
      toast.error("Failed to save report");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {sessionDetail?.selectedDoctor?.image ? (
                <Image src={sessionDetail.selectedDoctor.image} alt="Doctor" width={48} height={48} className="rounded-2xl object-cover" />
              ) : (
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                  {sessionDetail?.selectedDoctor?.name?.[0] || "D"}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${isVoiceMode ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{sessionDetail?.selectedDoctor?.name || "AI Doctor"}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{sessionDetail?.selectedDoctor?.specialty || "Medical Specialist"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isVoiceMode && <span className="text-sm font-mono text-slate-400">{formatTime(timer)}</span>}
            <Button 
              variant="outline" 
              onClick={generateReport} 
              disabled={generatingReport || messages.length < 2}
              className="hidden md:flex items-center gap-2 rounded-xl text-blue-600 border-blue-100 hover:bg-blue-50"
            >
              {generatingReport ? <Loader className="w-4 h-4 animate-spin" /> : "End & Generate Report"}
            </Button>
            <Button variant="ghost" size="icon" onClick={endCall} className="rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-slate-400" />
              </div>
              <p className="text-sm">Initializing secure medical session...</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-[2rem] text-sm shadow-sm ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-white/10"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <button 
                onClick={toggleVoiceMode}
                className={`p-4 rounded-2xl transition-all relative ${
                  isVoiceMode 
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" 
                    : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-500"
                }`}
              >
                {isVoiceMode ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
                
                {/* Visual Volume Meter Overlay */}
                {isVoiceMode && (
                  <div 
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div 
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                    />
                  </div>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500">
                <Languages className="w-3 h-3" />
                AUTO
              </div>
            </div>

            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder={
                  isTranscribing 
                    ? "Transcribing your voice..." 
                    : isVoiceMode 
                      ? "Listening... (Auto-detecting AM/EN)" 
                      : "Type your message..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                disabled={isVoiceMode || loading}
                className={`w-full pl-6 pr-14 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-50 ${
                  isTranscribing ? "animate-pulse border-blue-400" : ""
                }`}
              />
              <button 
                disabled={loading || !inputText.trim()}
                onClick={() => handleSendMessage(inputText)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <p className="text-[10px] text-center mt-4 text-slate-400 uppercase tracking-widest font-semibold">
            SECURE ENCRYPTED MEDICAL SESSION
          </p>
        </div>
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
