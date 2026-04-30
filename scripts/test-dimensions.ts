import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testDimensions() {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  
  const models = ["gemini-embedding-001", "gemini-embedding-2"];
  
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent("test");
      console.log(`Success with ${modelName}! Dimension: ${result.embedding.values.length}`);
    } catch (error) {
      console.error(`Error with ${modelName}:`, error);
    }
  }
}

testDimensions();
