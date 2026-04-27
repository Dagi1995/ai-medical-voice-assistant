import fetch from 'node-fetch';

async function listFreeModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const json = await res.json();
  const freeModels = json.data
    .filter(m => m.id.endsWith(':free'))
    .map(m => m.id);
  console.log(freeModels.join('\n'));
}

listFreeModels();
