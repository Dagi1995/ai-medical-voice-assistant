import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  try {
    // Note: The SDK doesn't have a direct listModels, we usually check docs
    // but we can try to test a common one
    console.log("Testing gemini-embedding-2...");
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent("test");
    console.log("Success with gemini-embedding-2! Dimension:", result.embedding.values.length);
  } catch (error) {
    console.error("Error with gemini-embedding-2:", error);
    
    try {
      console.log("Testing embedding-001...");
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const result = await model.embedContent("test");
      console.log("Success with embedding-001! Dimension:", result.embedding.values.length);
    } catch (e) {
      console.error("Error with embedding-001:", error);
    }
  }
}

listModels();
