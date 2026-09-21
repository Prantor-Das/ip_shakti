import type { Language } from '@/lib/i18n/languages';

export type Jurisdiction = 'india' | 'international';
export type FormulationType =
  | 'classical'
  | 'proprietary'
  | 'new-drug'
  | 'phytopharmaceutical'
  | 'nutraceutical'
  | 'cosmetic'
  | 'unsure';
export type MessageRole = 'user' | 'assistant';
export type Confidence = 'high' | 'medium' | 'low';

export interface ChatHistoryItem {
  role: MessageRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  lang: Language;
  jurisdiction: Jurisdiction;
  formulationType?: FormulationType;
  history: ChatHistoryItem[];
}

export interface Citation {
  id: string;
  documentId?: string;
  title: string;
  jurisdiction: Jurisdiction;
  sectionRef?: string;
  ref?: string;
  version?: string;
  asOfDate?: string;
  sourceUrl?: string;
}

export type ChatEvent =
  | { type: 'meta'; requestId: string; jurisdiction: Jurisdiction; lang: Language }
  | { type: 'delta'; text: string }
  | { type: 'status'; stage: 'translating' }
  | {
      type: 'done';
      confidence: Confidence;
      citations: Citation[];
      abstained: boolean;
      lang: Language;
      translated: boolean;
      translationFailed: boolean;
      englishText: string;
    }
  | { type: 'error'; code: string };
