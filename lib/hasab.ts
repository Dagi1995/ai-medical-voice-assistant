/**
 * Hasab AI Client
 * API Docs: https://developer.hasab.ai
 * 
 * Base URL: https://api.hasab.ai/api
 * Auth: Bearer token in Authorization header
 */

const HASAB_BASE_URL = "https://api.hasab.ai/api";

export class HasabAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Speech-to-Text (Transcription)
   * Endpoint: POST /v1/upload-audio
   * Content-Type: multipart/form-data
   * 
   * @param audioBlob - The audio file blob
   * @param language - Language code: "auto", "amh", "eng", "oro", "tir"
   */
  async transcribe(audioBlob: Blob, language: string = "auto") {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("transcribe", "true");
    formData.append("translate", "false");
    formData.append("summarize", "false");
    formData.append("language", language);
    formData.append("timestamps", "false");

    const response = await fetch(`${HASAB_BASE_URL}/v1/upload-audio`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        // Don't set Content-Type — let the browser set it with boundary for multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasab STT failed (${response.status}): ${error}`);
    }

    return await response.json();
  }

  /**
   * Text-to-Speech (TTS)
   * Endpoint: POST /v1/tts/synthesize
   * Content-Type: application/json
   * 
   * Returns audio file directly in the response body.
   * 
   * @param text - Text to convert to speech
   * @param language - "amh", "eng", "oro", "tir"
   * @param speakerName - Speaker voice: "Selam" (default), "Aster", "Hanna", "Yared", "Haile", "Tigist"
   */
  async textToSpeech(text: string, language: string = "amh", speakerName: string = "Selam") {
    const response = await fetch(`${HASAB_BASE_URL}/v1/tts/synthesize`, {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        language,
        speaker_name: speakerName,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasab TTS failed (${response.status}): ${error}`);
    }

    // The response body IS the audio file
    return response;
  }

  /**
   * Get available TTS speakers
   * Endpoint: GET /v1/tts/speakers
   */
  async getSpeakers(language?: string) {
    const url = new URL(`${HASAB_BASE_URL}/v1/tts/speakers`);
    if (language) url.searchParams.set("language", language);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasab speakers failed (${response.status}): ${error}`);
    }

    return await response.json();
  }
}

export const hasabClient = new HasabAPI(process.env.NEXT_PUBLIC_HASAB_API_KEY || "");
