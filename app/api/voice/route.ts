import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const previousMessages = JSON.parse(
      (formData.get("messages") as string) || "[]"
    );

    // Validate audio file
    if (!audioFile) {
      return NextResponse.json(
        {
          error: "No audio file provided",
          transcript: "",
          reply: "I couldn't hear anything. Please try again.",
          audio: null,
        },
        { status: 200 }
      );
    }

    // Log audio details for debugging
    console.log("Audio file received:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert File to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // ===========================================
    // 1️⃣ STT / TRANSLATION - Using /v1/upload-audio
    // ===========================================
    let transcript = "";
    let sttSuccess = false;

    try {
      console.log("Calling Hasab Transcription API: /v1/upload-audio");

      // Create FormData with the required structure
      const sttFormData = new FormData();

      // The audio file (must be MP3, WAV, or M4A)
      // Your frontend should convert to WAV before sending
      const audioBlob = new Blob([buffer], { type: "audio/wav" });
      sttFormData.append("file", audioBlob, "audio.wav");

      // Required parameters based on docs
      sttFormData.append("transcribe", "true"); // We want transcription
      sttFormData.append("translate", "false"); // Set to true if you want translation instead
      sttFormData.append("summarize", "false"); // We don't need summary here
      sttFormData.append("language", "auto"); // Auto-detect language

      // Optional: Add source language if you know it
      // sttFormData.append("source_language", "amh"); // For Amharic
      // sttFormData.append("timestamps", "false");

      const sttRes = await fetch("https://api.hasab.ai/v1/upload-audio", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HASAB_API_KEY}`,
          // Do NOT set Content-Type header
        },
        body: sttFormData,
      });

      console.log(`STT Response status:`, sttRes.status);

      if (sttRes.ok) {
        const data = await sttRes.json();
        console.log("STT Success response:", data);

        // Extract transcript - adjust based on actual response format
        transcript =
          data.text ||
          data.transcript ||
          data.data?.text ||
          data.transcription ||
          "";

        if (transcript) {
          console.log("Successfully got transcript:", transcript);
          sttSuccess = true;
        }
      } else {
        const errorText = await sttRes.text();
        console.error(`STT failed with status ${sttRes.status}:`, errorText);
      }
    } catch (error) {
      console.error("Error calling Hasab Transcription API:", error);
    }

    // Fallback if STT failed
    if (!sttSuccess || !transcript) {
      console.log("STT failed, using fallback message");
      transcript = "I couldn't understand the audio. Please speak clearly.";
    }

    // ===========================================
    // 2️⃣ CHAT - Using /v1/chat
    // ===========================================
    let replyText = "";
    let chatSuccess = false;

    try {
      console.log("Calling Hasab Chat API: /v1/chat");

      // Prepare messages for chat
      const chatMessages = [
        {
          role: "system",
          content:
            "You are a friendly medical assistant. Keep answers short (2-3 sentences) and ask only one follow-up question. Be professional but warm.",
        },
        ...previousMessages,
        { role: "user", content: transcript },
      ];

      // Format messages for Hasab API (they might expect a different format)
      // Based on docs, it uses "message" field, not "messages" array
      const lastUserMessage =
        chatMessages.filter((m) => m.role === "user").pop()?.content ||
        transcript;

      const chatBody: any = {
        message: lastUserMessage, // API expects single message string
        model: "hasab-1-main", // or "hasab-1-lite"
        temperature: 0.7,
        max_tokens: 150,
        stream: false,
      };

      // If you need to include conversation context, you might need to add it differently
      // This depends on how Hasab handles conversation history

      const chatRes = await fetch("https://api.hasab.ai/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HASAB_API_KEY}`,
        },
        body: JSON.stringify(chatBody),
      });

      if (chatRes.ok) {
        const data = await chatRes.json();
        console.log("Chat success response:", data);

        // Extract reply - adjust based on actual response format
        replyText =
          data.reply ||
          data.message ||
          data.text ||
          data.response ||
          data.choices?.[0]?.message?.content ||
          "";

        if (replyText) {
          console.log("Got chat reply:", replyText);
          chatSuccess = true;
        }
      } else {
        const errorText = await chatRes.text();
        console.error(`Chat failed with status ${chatRes.status}:`, errorText);
      }
    } catch (error) {
      console.error("Error calling Hasab Chat API:", error);
    }

    // Fallback if chat failed
    if (!chatSuccess || !replyText) {
      console.log("Chat failed, using fallback response");

      // Generate context-aware fallback based on transcript
      if (transcript.toLowerCase().includes("headache")) {
        replyText =
          "I hear you have a headache. How long has this been going on? And have you taken any medication for it?";
      } else if (transcript.toLowerCase().includes("fever")) {
        replyText =
          "I understand you have a fever. Do you have a thermometer? What's your temperature?";
      } else if (transcript.toLowerCase().includes("cough")) {
        replyText =
          "I hear you have a cough. Is it dry or productive? And how long have you had it?";
      } else {
        replyText =
          "Thank you for sharing that. Could you tell me more about your symptoms? When did they start?";
      }
    }

    // ===========================================
    // 3️⃣ TTS - Using /v1/tts/synthesize
    // ===========================================
    let base64Audio = null;

    try {
      console.log("Calling Hasab TTS API: /v1/tts/synthesize");

      const ttsBody = {
        text: replyText,
        language: "eng", // Use "eng" for English, "amh" for Amharic, etc.
        speaker_name: "default", // Optional, specify voice if needed
      };

      const ttsRes = await fetch("https://api.hasab.ai/v1/tts/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HASAB_API_KEY}`,
        },
        body: JSON.stringify(ttsBody),
      });

      if (ttsRes.ok) {
        // The response is the audio file directly
        const audioBuffer = await ttsRes.arrayBuffer();
        base64Audio = Buffer.from(audioBuffer).toString("base64");
        console.log("TTS success, audio size:", audioBuffer.byteLength);
      } else {
        const errorText = await ttsRes.text();
        console.error(`TTS failed with status ${ttsRes.status}:`, errorText);
      }
    } catch (error) {
      console.error("Error calling Hasab TTS API:", error);
    }

    // Return success response
    return NextResponse.json({
      transcript: transcript,
      reply: replyText,
      audio: base64Audio,
      success: true,
    });
  } catch (error) {
    console.error("Voice API critical error:", error);

    // Return graceful error response
    return NextResponse.json(
      {
        error: "Server error occurred",
        details: error instanceof Error ? error.message : String(error),
        transcript: "System error occurred",
        reply:
          "I'm experiencing technical difficulties. Please try again in a moment.",
        audio: null,
        success: false,
      },
      { status: 200 } // Return 200 to prevent frontend from throwing
    );
  }
}
