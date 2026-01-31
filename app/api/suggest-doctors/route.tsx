import { openai } from "@/app/config/OpenAiModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        { role: "user", content: "User Notes/Symptoms"+notes+",Depends on user notes and symptoms, Please suggest list of doctors, Return Object in JSON only" },
      ],
    });
    const rawResp = completion.choices[0].message;
    return NextResponse.json(rawResp)
  } catch (e) {
    return NextResponse.json(e)
  }
}
