import 'server-only';

import { translate as translateBhashini } from '@/lib/translate/bhashini';
import { translate as translateGemini } from '@/lib/translate/gemini';
import { protect, restore } from '@/lib/translate/protect';
import type { Language } from '@/lib/i18n/languages';

export interface TranslationResult {
  text: string;
  translationFailed: boolean;
}

export async function translateText(
  text: string,
  from: Language,
  to: Language
): Promise<TranslationResult> {
  if (from === to || !text) return { text, translationFailed: false };
  const protectedText = protect(text);
  const providers = [translateBhashini, translateGemini];
  for (const provider of providers) {
    const startedAt = Date.now();
    try {
      const translated = await provider(protectedText.text, from, to);
      const restored = restore(translated, protectedText.placeholders);
      if (restored !== null) return { text: restored, translationFailed: false };
    } catch {
      console.warn('Translation provider failed', { from, to, latencyMs: Date.now() - startedAt });
    }
  }
  return { text, translationFailed: true };
}
