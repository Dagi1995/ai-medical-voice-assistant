import 'dotenv/config';

async function findFlash() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const flashModels = data.models.filter(m => m.name.toLowerCase().includes("flash"));
    console.log(JSON.stringify(flashModels, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

findFlash();
