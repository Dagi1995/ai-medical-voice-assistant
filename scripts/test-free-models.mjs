import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.OPEN_ROUTE_API_KEY;

async function testModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const json = await res.json();
  const freeModels = json.data
    .filter(m => m.id.endsWith(':free'))
    .map(m => m.id);

  console.log(`Found ${freeModels.length} free models. Testing top ones...`);

  for (const model of freeModels.slice(0, 10)) {
    console.log(`Testing ${model}...`);
    try {
      const testRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'say hi' }],
          max_tokens: 10
        })
      });
      const data = await testRes.json();
      if (testRes.status === 200) {
        console.log(`✅ ${model} works!`);
      } else {
        console.log(`❌ ${model} failed with ${testRes.status}`);
      }
    } catch (e) {
      console.log(`❌ ${model} error: ${e.message}`);
    }
  }
}

testModels();
