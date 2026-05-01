import { NextRequest, NextResponse } from "next/server";
import { addisClient } from "../../../lib/addis";
import { hasabClient } from "../../../lib/hasab";

export async function POST(req: NextRequest) {
  try {
    const { text, language, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Detect language: check for Ethiopic script
    const isAmharic = /[\u1200-\u137F]/.test(text);

    console.log(`TTS Request: "${text.substring(0, 50)}..." [${isAmharic ? "am" : "en"}] (voice: ${voiceId || "default"})`);

    // 1. Try Hasab AI TTS first (better Amharic voices)
    try {
      const hasabLang = isAmharic ? "amh" : "eng";
      const speakerName = voiceId || (isAmharic ? "Selam" : "default");

      const response = await hasabClient.textToSpeech(text, hasabLang, speakerName);
      const audioBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "audio/wav";
      const base64Audio = Buffer.from(audioBuffer).toString("base64");

      console.log("Hasab TTS success, audio size:", audioBuffer.byteLength);
      return NextResponse.json({ audio: base64Audio, content_type: contentType });
    } catch (hasabErr: any) {
      console.warn("Hasab TTS failed:", hasabErr.message);
    }

    // 2. Fallback to Addis AI TTS
    try {
      const langCode = isAmharic ? "am" : "en";
      const result = await addisClient.textToSpeech(text, langCode, voiceId);
      
      console.log("Addis TTS success");
      
      // Extract audio from Addis response
      const audioData = result.audio || result.audio_base64 || result.data?.audio;
      const audioUrl = result.audio_url || result.url;

      if (audioData) {
        return NextResponse.json({ audio: audioData, content_type: "audio/wav" });
      } else if (audioUrl) {
        return NextResponse.json({ audio_url: audioUrl });
      }

      return NextResponse.json(result);
    } catch (addisErr: any) {
      console.warn("Addis TTS also failed:", addisErr.message);
    }

    // 3. No TTS available — return error
    return NextResponse.json({ error: "All TTS providers failed" }, { status: 500 });

  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
