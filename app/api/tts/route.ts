import { NextRequest, NextResponse } from "next/server";
import { addisClient } from "../../../lib/addis";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const result = await addisClient.textToSpeech(text, language || "am");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
