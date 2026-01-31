import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/app/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notes = body?.notes;

  if (!notes) {
    return NextResponse.json({ error: "Missing notes" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            ", Depends on user notes and symptoms, Please suggest list of doctors, Return Object in JSON only",
        },
      ],
    });
    console.log("completion:", JSON.stringify(completion));

    const rawMsg = (completion.choices?.[0]?.message as any)?.content || "";

    // Remove common code fence wrappers and trim
    const cleaned = rawMsg
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error(
        "Failed to parse model response as JSON:",
        cleaned,
        parseErr
      );
      return NextResponse.json(
        { error: "Failed to parse model response", details: cleaned },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("suggest-doctors error:", e);
    const message = (e as any)?.message || JSON.stringify(e);
    return NextResponse.json(
      { error: "AI request failed", details: message },
      { status: 502 }
    );
  }
}
