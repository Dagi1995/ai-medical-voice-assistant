import { NextRequest, NextResponse } from "next/server";
import { addisClient } from "../../../lib/addis";
import { hasabClient } from "../../../lib/hasab";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    console.log("STT Request: Received audio blob of size", audioFile.size, "type:", audioFile.type);

    let transcription = "";
    let confidence = 1.0;
    let provider = "";

    // 1. Try Addis AI first (reliable, fast)
    try {
      const result = await addisClient.transcribe(audioFile, "am");
      console.log("Addis STT Result:", result);
      
      transcription = result.text || result.transcription || result.data?.transcription || "";
      confidence = result.confidence ?? result.data?.confidence ?? 1.0;
      provider = "Addis";
    } catch (addisErr: any) {
      console.warn("Addis STT failed:", addisErr.message);

      // 2. Fallback to Hasab AI (with a 8s timeout)
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const hasabResult = await hasabClient.transcribe(audioFile, "auto");
        clearTimeout(timeout);

        console.log("Hasab STT Result:", hasabResult);
        transcription = hasabResult.transcription || hasabResult.audio?.transcription || "";
        provider = "Hasab";
      } catch (hasabErr: any) {
        console.warn("Hasab STT also failed:", hasabErr.message);
        return NextResponse.json({ error: "All STT providers failed" }, { status: 500 });
      }
    }

    console.log(`[${provider}] Final Transcription: "${transcription}" (Confidence: ${confidence})`);

    // Filter out low confidence noise or empty results
    if (!transcription || transcription.trim().length === 0 || (confidence < 0.4 && transcription.length < 5)) {
      return NextResponse.json({ text: "" });
    }

    return NextResponse.json({ text: transcription.trim() });

  } catch (error: any) {
    console.error("STT Route Critical Error:", error);
    return NextResponse.json({ error: error.message || "Transcription failed" }, { status: 500 });
  }
}
