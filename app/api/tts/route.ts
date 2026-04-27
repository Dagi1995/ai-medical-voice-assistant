import { NextRequest, NextResponse } from "next/server";
import { addisClient } from "../../../lib/addis";

export async function POST(req: NextRequest) {
  try {
    const { text, language, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log(`TTS Request: "${text.substring(0, 30)}..." [${language || "am"}] (voice: ${voiceId || "default"})`);

    const result = await addisClient.textToSpeech(text, language || "am", voiceId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
