import { db } from "@/config/db";
import { aiDoctorsTable } from "@/config/schema";
import { openai } from "@/config/OpenAiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notes = body?.notes;

  if (!notes) {
    return NextResponse.json({ error: "Missing notes" }, { status: 400 });
  }

  try {
    const doctors = await db.select().from(aiDoctorsTable);

    const completion = await openai.chat.completions.create({
      model: "gemini-flash-latest",
      messages: [
        { role: "system", content: JSON.stringify(doctors) },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            '. Suggest relevant doctors from the above list. Return only JSON in this format: { "suggestedDoctors": [ ... ] }',
        },
      ],
    });

    const rawMsg = (completion.choices?.[0]?.message as any)?.content || "";

    const cleaned = rawMsg
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", cleaned);
      parsed = { suggestedDoctors: [] };
    }

    // Ensure payload always has suggestedDoctors key
    if (Array.isArray(parsed)) {
      parsed = { suggestedDoctors: parsed };
    } else if (!parsed.suggestedDoctors) {
      parsed = { suggestedDoctors: [] };
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error("AI request failed:", e);
    return NextResponse.json(
      { suggestedDoctors: [], error: "AI request failed" },
      { status: 502 }
    );
  }
}
