import { NextRequest, NextResponse } from "next/server";
import { addisClient } from "../../../lib/addis";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;
    const language = formData.get("language") as string || "am";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const result = await addisClient.transcribe(audioFile, language);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("STT Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
