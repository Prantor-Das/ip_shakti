import 'server-only';

import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

interface StreamTextInput {
  system: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  signal?: AbortSignal;
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';

function client(signal?: AbortSignal): GoogleGenAI {
  const fetchWithSignal: typeof fetch = (input, init) =>
    fetch(input, { ...init, signal: signal ?? init?.signal });
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { fetch: fetchWithSignal },
  });
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

async function* generate(model: string, input: StreamTextInput): AsyncGenerator<string> {
  const response = await client(input.signal).models.generateContentStream({
    model,
    contents: contentsFor(input),
    config: {
      systemInstruction: input.system,
      temperature: 0.2,
      maxOutputTokens: 4096,
      thinkingConfig:
        model === 'gemini-3.8-flash' ? { thinkingLevel: ThinkingLevel.LOW } : { thinkingBudget: 0 },
    },
  });
  for await (const chunk of response) {
    const text = chunk.text;
    if (text) yield text;
  }
}

export async function* streamText(input: StreamTextInput): AsyncGenerator<string> {
  if (!process.env.GEMINI_API_KEY) throw new Error('AI provider is not configured');
  try {
    yield* generate(MODEL, input);
  } catch (error: unknown) {
    if (!isRetryable(error) || MODEL === FALLBACK_MODEL) throw error;
    yield* generate(FALLBACK_MODEL, input);
  }
}

export async function embedTexts(_texts: string[], _taskType: string): Promise<never> {
  void _texts;
  void _taskType;
  throw new Error('Embedding support is planned for the corpus ingestion step.');
}
