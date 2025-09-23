import { pipeline, FeatureExtractionPipeline, TextGenerationPipeline } from '@xenova/transformers';

// Cache for loaded models with proper typing
let embeddingModel: FeatureExtractionPipeline | null = null;
let textModel: TextGenerationPipeline | null = null;

// Multilingual embedding model - supports 50+ languages
export async function getEmbedding(text: string): Promise<number[]> {
  if (!embeddingModel) {
    embeddingModel = (await pipeline(
      'feature-extraction',
      'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
    )) as FeatureExtractionPipeline;
  }

  const output = await embeddingModel(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data);
}

export async function generateAnswer(context: string, question: string): Promise<string> {
  if (!textModel) {
    textModel = (await pipeline('text-generation', 'Xenova/gpt2', {
      quantized: true,
    })) as TextGenerationPipeline;
  }

  let prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;

  const MAX_PROMPT_LENGTH = 1024;
  if (prompt.length > MAX_PROMPT_LENGTH) {
    prompt = prompt.slice(-MAX_PROMPT_LENGTH);
  }

  const response = await textModel(prompt, {
    max_new_tokens: 256,
    temperature: 0.7,
    do_sample: true,
  });

  // Handle different response structures
  if (Array.isArray(response)) {
    const generatedText = response[0] as { generated_text: string };
    return generatedText.generated_text.replace(prompt, '').trim();
  } else if (typeof response === 'object' && response !== null) {
    const generatedText =
      (response as { generated_text?: string }).generated_text ||
      (response as { text?: string }).text ||
      JSON.stringify(response);
    return generatedText.replace(prompt, '').trim();
  } else {
    return String(response).replace(prompt, '').trim();
  }
}
