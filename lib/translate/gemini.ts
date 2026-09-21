import 'server-only';

import { translateWithGemini } from '@/lib/ai/provider';
import type { Language } from '@/lib/i18n/languages';

export async function translate(
  text: string,
  from: Language,
  to: Language,
  signal?: AbortSignal
): Promise<string> {
  return translateWithGemini(text, from, to, signal);
}
