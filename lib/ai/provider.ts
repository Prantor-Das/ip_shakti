import 'server-only';

import {
  embedTextsWithApiKey,
  generateTextStream,
  generateText,
  isProviderRetryable,
} from '@/lib/ai/provider-core';
import { env } from '@/lib/env';

interface StreamTextInput {
  system: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  signal?: AbortSignal;
}

export async function translateWithGemini(
  text: string,
  from: string,
  to: string,
  signal?: AbortSignal
): Promise<string> {
  const result = await generateText(env.GEMINI_API_KEY, env.GEMINI_TRANSLATION_MODEL, {
    system: `Translate the supplied text from ${from} to ${to}. Return only the translation. Preserve every placeholder token exactly, including capitalization and underscores. Do not add explanations.`,
    message: text,
    signal,
  });
  if (!result.trim()) throw new Error('Gemini returned no translation');
  return result.trim();
}

const MODEL = env.GEMINI_MODEL;
const FALLBACK_MODEL = env.GEMINI_FALLBACK_MODEL;

export async function* streamText(input: StreamTextInput): AsyncGenerator<string> {
  const apiKey = env.GEMINI_API_KEY;
  try {
    yield* generateTextStream(apiKey, MODEL, input);
  } catch (error: unknown) {
    if (!isProviderRetryable(error) || MODEL === FALLBACK_MODEL) throw error;
    yield* generateTextStream(apiKey, FALLBACK_MODEL, input);
  }
}

export async function embedTexts(
  texts: string[],
  taskType: string,
  signal?: AbortSignal
): Promise<number[][]> {
  return embedTextsWithApiKey(env.GEMINI_API_KEY, texts, taskType, signal);
}
