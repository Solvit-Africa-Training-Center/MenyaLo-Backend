import * as fs from 'fs';
import pdfParse from 'pdf-parse';
import ollama, { type EmbeddingsResponse } from 'ollama';

async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}

export async function extractTextAndEmbedding(filePath: string): Promise<{
  content: string;
  embedding: number[];
}> {
  const text = await extractTextFromPDF(filePath);

  const response: EmbeddingsResponse = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  });

  if (!Array.isArray(response.embedding) || response.embedding.length === 0) {
    throw new Error('No embedding returned from Ollama');
  }

  return {
    content: text,
    embedding: response.embedding,
  };
}
