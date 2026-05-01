import { db } from "@/config/db";
import { sessionsChatTable } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getNearbyHealthFacilities } from "@/lib/overpass";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages, latitude, longitude } = await req.json();

    if (!sessionId || !messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Prepare conversation text for AI
    const conversationText = messages
      .map((m: any) => `${m.role === "assistant" ? "Doctor" : "Patient"}: ${m.text}`)
      .join("\n");

    // 2. Ask Gemini to summarize and create a medical report
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are a medical scribe. Analyze the following conversation between a patient and an AI Medical Assistant.
      Generate a structured medical report in JSON format with the following fields:
      - symptoms: string[]
      - observations: string (summary of what the patient said)
      - potential_concerns: string[]
      - recommendations: string[]
      - urgency: "Low" | "Medium" | "High" | "Emergency"

      Conversation:
      ${conversationText}

      Respond ONLY with the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("AI failed to generate valid JSON report");
    const reportData = JSON.parse(jsonMatch[0]);

    if (latitude && longitude) {
      try {
        const facilities = await getNearbyHealthFacilities(latitude, longitude, 5000); // 5km radius
        reportData.nearby_facilities = facilities;
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      }
    }

    // 3. Update the session in the database
    await db
      .update(sessionsChatTable)
      .set({
        report: reportData,
      })
      .where(eq(sessionsChatTable.sessionId, sessionId));

    return NextResponse.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error("Report Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
