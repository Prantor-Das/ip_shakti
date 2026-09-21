import 'server-only';

import {
  embedTextsWithApiKey,
  generateTextStream,
  generateText,
  isProviderRetryable,
} from '@/lib/ai/provider-core';

interface StreamTextInput {
  system: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  signal?: AbortSignal;
}

export async function translateWithGemini(text: string, from: string, to: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('AI provider is not configured');
  const model = process.env.GEMINI_TRANSLATION_MODEL || MODEL;
  const result = await generateText(apiKey, model, {
    system: `Translate the supplied text from ${from} to ${to}. Return only the translation. Preserve every placeholder token exactly, including capitalization and underscores. Do not add explanations.`,
    message: text,
  });
  if (!result.trim()) throw new Error('Gemini returned no translation');
  return result.trim();
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';

export async function* streamText(input: StreamTextInput): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('AI provider is not configured');
  try {
    yield* generateTextStream(apiKey, MODEL, input);
  } catch (error: unknown) {
    if (!isProviderRetryable(error) || MODEL === FALLBACK_MODEL) throw error;
    yield* generateTextStream(apiKey, FALLBACK_MODEL, input);
  }
}

export async function embedTexts(texts: string[], taskType: string): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('AI provider is not configured');
  return embedTextsWithApiKey(apiKey, texts, taskType);
}
