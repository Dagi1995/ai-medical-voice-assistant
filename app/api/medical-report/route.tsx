import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { report } from "process";
import { Session } from "inspector/promises";
import { db } from "@/config/db";
import { sessionsChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const REPORT_GEN_PROMPT = `Yoi are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and Conversation between AI medical agent and user, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. cheifComplaint: one-sentence summary of the main health concern
6. summary:a 2-3 sentence summary of the conversation, symptoms, and
7. symptoms:list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:{
"sessionId": "string",
"agent": "string",
"user": "string",
"timestamp": "ISO Date string",
"cheifComplaint": "string",
"summary": "string",
"symptoms": ["symtom1", "symtom2"],
"duration": "string",
"severity": "string",
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"]
}
Only include valid fields. Respond with nothing else.
`;
export async function POST(request: NextRequest) {
  const { sessionId, sessionDetail, message } = await request.json();

  try {
    const UserInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetail) +
      ", Conversation:" +
      JSON.stringify(message);
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: UserInput },
      ],
    });

    const rawResp = completion.choices[0].message;

    //@ts-ignore
    const resp = rawResp.content
      .trim()
      .replace("```json", "")
      .replace("```", "");
    const JSONResp = JSON.parse(resp);

    // Save to Database
    const result = await db
      .update(sessionsChatTable)
      .set({
        report: JSONResp,
        conversation: message,
      })
      .where(eq(sessionsChatTable.sessionId, sessionId));

    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
