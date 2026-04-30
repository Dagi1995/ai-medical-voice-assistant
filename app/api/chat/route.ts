import { db } from "@/config/db";
import { aiDoctorKnowledgeTable, aiDoctorsTable, sessionsChatTable } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, doctorId, history = [] } = body;

    console.log("Chat Request Body:", { message, sessionId, doctorId, historyCount: history.length });

    if (!message || !doctorId) {
      console.warn("Missing fields in request:", { message, doctorId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Doctor Info
    const doctor = await db.query.aiDoctorsTable.findFirst({
      where: eq(aiDoctorsTable.id, doctorId),
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    let context = "";

    // 2. Perform RAG if enabled
    if (doctor.hasRag) {
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
      const embeddingRes = await model.embedContent(message);
      const embedding = embeddingRes.embedding.values;

      // pgvector similarity search (using cosine distance <=>)
      // We search for chunks belonging to THIS doctor
      const similarityThreshold = 0.5; // Adjust based on needs
      const matches = await db.execute(sql`
        SELECT content, 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
        FROM "aiDoctorKnowledge"
        WHERE "doctorId" = ${doctorId}
        AND 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) > ${similarityThreshold}
        ORDER BY similarity DESC
        LIMIT 3
      `);

      //@ts-ignore
      context = matches.rows.map((r: any) => r.content).join("\n\n");
    }

    // 3. Construct System Instructions
    const systemInstruction = `
      ${doctor.agentPrompt}
      
      [MEDICAL SAFETY RULES]:
      - Provide general wellness information only.
      - NEVER diagnose, prescribe medication, or suggest specific treatments.
      - Include the disclaimer "I am an AI, not a doctor. Seek professional help for emergencies." ONLY in the very first greeting or when a serious medical concern is raised. DO NOT repeat it in every message.
      - ALWAYS recommend consulting a healthcare professional for serious concerns.

      [CONTEXT FROM KNOWLEDGE BASE]:
      ${context || "No specific background knowledge found for this query. Use your general medical training."}

      [LANGUAGE]:
      - If the user speaks in Amharic (Ethiopic script), you MUST respond in Amharic.
      - If the user speaks in English, you MUST respond in English.
      - Default to Amharic if the user's intent is unclear but they are in an Ethiopian context.
      
      [STYLE]: Keep responses short, clear, and empathetic.
    `;

    // 4. Call Gemini with Streaming
    // 4. Call Gemini with Streaming (with Retry for 503)
    const chatModel = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction 
    });

    let userQuery = message;
    if (message === "GREETING_START") {
      userQuery = "Please provide a warm greeting in Amharic (or English if that's the session preference), introduce yourself as " + doctor.name + ", and ask how I am feeling today.";
    }

    let chatResult;
    let retries = 3;
    while (retries > 0) {
      try {
        chatResult = await chatModel.generateContentStream({
          contents: [
            ...history,
            { role: "user", parts: [{ text: userQuery }] }
          ],
        });
        break; // Success
      } catch (err: any) {
        if (err.message?.includes("503") || err.message?.includes("overloaded")) {
          retries--;
          console.warn(`Gemini 503 error, retrying... (${retries} left)`);
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw err;
        }
      }
    }

    if (!chatResult) throw new Error("Failed to initialize chat stream");

    // 5. Create a Streaming Response
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        try {
          for await (const chunk of chatResult.stream) {
            let chunkText = "";
            try {
              chunkText = chunk.text();
            } catch (e) {
              // This can happen if a chunk contains only safety ratings or metadata
              console.warn("Chunk without text received");
              continue;
            }

            if (chunkText) {
              fullText += chunkText;
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ text: chunkText }) + "\n"));
            }
          }

          // 6. Update Session History (Async)
          if (sessionId) {
            const updatedHistory = [
              ...history, 
              { role: "user", parts: [{ text: message }] }, 
              { role: "model", parts: [{ text: fullText }] }
            ];
            await db.update(sessionsChatTable)
              .set({ conversation: updatedHistory })
              .where(eq(sessionsChatTable.sessionId, sessionId));
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" },
    });

  } catch (error: any) {
    console.error("Chat API Critical Error:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
