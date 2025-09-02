import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:11434';

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text || !text.trim()) {
    throw new Error('No text provided for embedding');
  }

  const response = await fetch(`${BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text:latest',
      prompt: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding failed: ${err}`);
  }

  const data = (await response.json()) as { embedding?: number[] };
  const embedding = data.embedding ?? [];

  if (!embedding.length) {
    throw new Error('Failed to generate embedding (empty array)');
  }

  return embedding;
}

export async function generateAnswer(context: string, question: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral:7b-instruct-q4_K_M',
      prompt: `Use this context to answer the question:\n\n${context}\n\nQuestion: ${question}`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Answer request failed');
  }

  const text = await response.text();
  try {
    const json = JSON.parse(text) as { response?: string };
    return json.response ?? text;
  } catch {
    return text;
  }
}
