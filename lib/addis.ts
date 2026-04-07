export class AddisAPI {
  private apiKey: string;
  private baseUrl = "https://api.addisassistant.com/api";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribe(audioBlob: Blob, languageCode: string = "am") {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append(
      "request_data",
      JSON.stringify({ language_code: languageCode })
    );

    const response = await fetch(`${this.baseUrl}/v2/stt`, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`STT failed: ${error}`);
    }

    return await response.json();
  }

  async generateChat(
    prompt: string,
    targetLanguage: string = "am",
    history: any[] = []
  ) {
    const response = await fetch(`${this.baseUrl}/v1/chat_generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        model: "Addis-፩-አሌፍ",
        prompt: prompt,
        target_language: targetLanguage,
        conversation_history: history,
        generation_config: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chat failed: ${error}`);
    }

    return await response.json();
  }

  async textToSpeech(text: string, language: string = "am") {
    // Ensuring the endpoint is exactly /v1/audio per user input and typical Addis design
    const response = await fetch(`${this.baseUrl}/v1/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        text: text,
        language: language,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TTS failed: ${error}`);
    }

    return await response.json();
  }
}

export const addisClient = new AddisAPI(process.env.ADDIS_API_KEY || "");
