import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import { env } from '@/lib/env-core';

interface StreamTextInput {
  system: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  signal?: AbortSignal;
}

interface GenerateTextInput {
  system: string;
  message: string;
  signal?: AbortSignal;
}

function client(apiKey: string, signal?: AbortSignal): GoogleGenAI {
  const fetchWithSignal: typeof fetch = (input, init) =>
    fetch(input, { ...init, signal: signal ?? init?.signal });
  return new GoogleGenAI({ apiKey, httpOptions: { fetch: fetchWithSignal } });
}

function contentsFor(input: StreamTextInput): Content[] {
  return [
    ...input.history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    { role: 'user', parts: [{ text: input.message }] },
  ];
}

function isRetryable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const status = 'status' in error ? error.status : undefined;
  return status === 429 || status === 503;
}

export async function* generateTextStream(
  apiKey: string,
  model: string,
  input: StreamTextInput
): AsyncGenerator<string> {
  const response = await client(apiKey, input.signal).models.generateContentStream({
    model,
    contents: contentsFor(input),
    config: {
      systemInstruction: input.system,
      temperature: 0.2,
      maxOutputTokens: env.MAX_OUTPUT_TOKENS,
      thinkingConfig:
        model === 'gemini-3.8-flash' ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
    },
  });
  for await (const chunk of response) if (chunk.text) yield chunk.text;
}

export async function generateText(
  apiKey: string,
  model: string,
  input: GenerateTextInput
): Promise<string> {
  const response = await client(apiKey, input.signal).models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: input.message }] }],
    config: {
      systemInstruction: input.system,
      temperature: 0.1,
      maxOutputTokens: env.MAX_OUTPUT_TOKENS,
    },
  });
  return response.text ?? '';
}

export function isProviderRetryable(error: unknown): boolean {
  return isRetryable(error);
}

function l2Normalize(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  return magnitude === 0 ? values : values.map((value) => value / magnitude);
}

export async function embedTextsWithApiKey(
  apiKey: string,
  texts: string[],
  taskType: string,
  signal?: AbortSignal
): Promise<number[][]> {
  if (texts.length === 0) return [];
  const model = env.GEMINI_EMBEDDING_MODEL;

  // Embed texts individually to stay safely within Free Tier token-per-request quotas (max 2,048 tokens per call)
  const results: number[][] = [];
  for (const text of texts) {
    const response = await client(apiKey, signal).models.embedContent({
      model,
      contents: [{ parts: [{ text }] }],
      config: { taskType, outputDimensionality: env.EMBEDDING_DIM },
    });
    const embeddingValues = response.embeddings?.[0]?.values ?? [];
    results.push(l2Normalize(embeddingValues));
  }
  return results;
}
