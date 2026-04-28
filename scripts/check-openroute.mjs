import dotenv from "dotenv";

dotenv.config();

const key = process.env.OPEN_ROUTE_API_KEY;
if (!key) {
  console.error("OPEN_ROUTE_API_KEY not found in .env");
  process.exit(2);
}

const body = {
  model: "nvidia/nemotron-3-super-120b-a12b:free",
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
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
