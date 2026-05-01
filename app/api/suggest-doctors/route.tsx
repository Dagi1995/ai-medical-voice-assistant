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
            '. Suggest relevant doctors from the above list. Return an array of their IDs. Return only JSON in this format: { "suggestedDoctorIds": [ 1, 2, ... ] }',
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
      parsed = { suggestedDoctorIds: [] };
    }

    let suggestedDoctors: any[] = [];
    if (parsed.suggestedDoctorIds && Array.isArray(parsed.suggestedDoctorIds)) {
      suggestedDoctors = parsed.suggestedDoctorIds
        .map((id: any) => doctors.find((d) => d.id === Number(id)))
        .filter(Boolean);
    } else if (parsed.suggestedDoctors && Array.isArray(parsed.suggestedDoctors)) {
      // Fallback if AI still returns suggestedDoctors array of objects
      suggestedDoctors = parsed.suggestedDoctors
        .map((d: any) => doctors.find((doc) => doc.id === d.id || doc.name === d.name))
        .filter(Boolean);
    } else if (Array.isArray(parsed)) {
      // Fallback if AI returns just an array of IDs or objects
      suggestedDoctors = parsed
        .map((item: any) => {
          if (typeof item === "number" || typeof item === "string") {
            return doctors.find((d) => d.id === Number(item));
          }
          return doctors.find((doc) => doc.id === item.id || doc.name === item.name);
        })
        .filter(Boolean);
    }

    return NextResponse.json({ suggestedDoctors });
  } catch (e) {
    console.error("AI request failed:", e);
    return NextResponse.json(
      { suggestedDoctors: [], error: "AI request failed" },
      { status: 502 }
    );
  }
}
