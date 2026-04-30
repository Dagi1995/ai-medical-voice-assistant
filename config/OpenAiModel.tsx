import OpenAI from "openai"
export const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
})