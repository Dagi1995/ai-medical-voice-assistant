import dotenv from "dotenv";

dotenv.config();

const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!key) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY not found in .env");
  process.exit(2);
}

const body = {
  model: "gemini-flash-latest",
  messages: [
    {
      role: "user",
      content: "Return a JSON array with one doctor object. Only return JSON.",
    },
  ],
  temperature: 0,
  max_tokens: 200,
};

(async () => {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("status", res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log("response JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("response text:", text);
    }
  } catch (err) {
    console.error("request error:", err);
  }
})();
