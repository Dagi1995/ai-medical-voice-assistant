"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface AddisRealtimeOptions {
  apiKey: string;
  onTranscript?: (text: string) => void;
  onMessage?: (role: "user" | "assistant", content: string) => void;
  onGreetingStart?: () => void;
  onGreetingEnd?: () => void;
  systemInstructions?: string;
  onError?: (error: any) => void;
}

export function useAddisRealtime({ apiKey, onTranscript, onMessage, onGreetingStart, onGreetingEnd, systemInstructions, onError }: AddisRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Refs to avoid stale closures in onaudioprocess/onmessage
  const isConnectedRef = useRef(false);
  const isStreamingRef = useRef(false);

  useEffect(() => {
    isConnectedRef.current = isConnected;
    isStreamingRef.current = isStreaming;
  }, [isConnected, isStreaming]);

  const stopRealtime = useCallback(() => {
    setIsStreaming(false);
    setIsConnected(false);

    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) {
        socketRef.current.close(1000, "client-stop");
      }
    }

    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    
    // We don't always want to close contexts immediately to avoid "suspended" state issues on restart
  }, []);

  const playAudioBuffer = useCallback((buffer: AudioBuffer) => {
    if (!outputContextRef.current) return;
    
    const src = outputContextRef.current.createBufferSource();
    src.buffer = buffer;
    src.connect(outputContextRef.current.destination);
    
    const startAt = Math.max(outputContextRef.current.currentTime, nextStartTimeRef.current);
    src.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;
  }, []);

  const playPcm16Base64 = useCallback(async (base64Audio: string, sampleRate = 24000) => {
    if (!outputContextRef.current) return;
    
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      const buffer = outputContextRef.current.createBuffer(1, float32.length, sampleRate);
      buffer.copyToChannel(float32, 0);
      playAudioBuffer(buffer);
    } catch (err) {
      console.error("PCM Playback Error:", err);
    }
  }, [playAudioBuffer]);

  const startRealtime = useCallback(async () => {
    try {
      // 1. Setup Audio Contexts
      if (!outputContextRef.current) {
        outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      await outputContextRef.current.resume();
      nextStartTimeRef.current = outputContextRef.current.currentTime;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      await audioContextRef.current.resume();

      // 2. Get Media Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      const mute = audioContextRef.current.createGain();
      mute.gain.value = 0;
      source.connect(processor);
      processor.connect(mute);
      mute.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (event) => {
        if (!isStreamingRef.current || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

        const float32 = event.inputBuffer.getChannelData(0);
        // Convert to PCM16
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const bytes = new Uint8Array(int16.buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        
        socketRef.current.send(JSON.stringify({
          data: btoa(binary),
          mimeType: "audio/pcm;rate=16000",
        }));
      };

      // 3. Connect WebSocket
      const WS_URL = `wss://relay.addisassistant.com/ws?apiKey=${encodeURIComponent(apiKey)}`;
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Realtime WebSocket Connected");
        setIsConnected(true);
      };

      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        if (message.setupComplete || (message.type === "status" && /ready/i.test(message.message || ""))) {
          setIsStreaming(true);
          
          // Send system instructions if provided to prime the persona
          if (systemInstructions) {
            socket.send(JSON.stringify({
              text: systemInstructions
            }));
          }
          return;
        }

        const b64 = message?.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (typeof b64 === "string" && b64.length) {
          await playPcm16Base64(b64, 24000);
        }

        // Handle text messages for UI
        if (message?.serverContent?.modelTurn?.parts?.[0]?.text) {
          onMessage?.("assistant", message.serverContent.modelTurn.parts[0].text);
        }

        if (message?.error) {
          onError?.(message.error);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        setIsStreaming(false);
      };

      socket.onerror = (err) => {
        onError?.(err);
      };

    } catch (err) {
      onError?.(err);
      stopRealtime();
    }
  }, [apiKey, onMessage, onError, stopRealtime, playPcm16Base64, systemInstructions]);

  const playGreeting = useCallback(async (text: string) => {
    try {
      if (!outputContextRef.current) return;
      
      onGreetingStart?.();
      
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "am" }),
      });
      const data = await response.json();
      const b64 = data.data?.audio || data.audio;
      
      if (b64) {
        // For standard TTS files (WAV/MP3), use decodeAudioData
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        
        const audioBuffer = await outputContextRef.current.decodeAudioData(bytes.buffer);
        playAudioBuffer(audioBuffer);
        onGreetingEnd?.();
      }
    } catch (err) {
      console.error("Greeting Error:", err);
      onError?.(err);
    }
  }, [onGreetingStart, onGreetingEnd, onError, playAudioBuffer]);

  const sendTextMessage = useCallback((text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text }));
    }
  }, []);

  useEffect(() => {
    return () => stopRealtime();
  }, [stopRealtime]);

  return { isConnected, isStreaming, startRealtime, stopRealtime, playGreeting, sendTextMessage };
}
