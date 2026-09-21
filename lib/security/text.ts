import type { ChatHistoryItem } from '@/lib/chat/types';

const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_CHARS = 8000;

export function sanitizeUserText(value: string): string {
  return value.replace(/[\p{Cc}\p{Cf}]/gu, '').trim();
}

export function sanitizeHistory(history: ChatHistoryItem[]): ChatHistoryItem[] {
  const firstUser = history.findIndex((item) => item.role === 'user');
  if (firstUser < 0) return [];
  const sanitized: ChatHistoryItem[] = [];
  let expected: ChatHistoryItem['role'] = 'user';
  let chars = 0;
  for (const item of history.slice(firstUser)) {
    if (item.role !== expected) break;
    const content = sanitizeUserText(item.content).slice(0, 2000);
    if (!content || chars + content.length > MAX_HISTORY_CHARS) break;
    sanitized.push({ role: item.role, content });
    chars += content.length;
    expected = expected === 'user' ? 'assistant' : 'user';
    if (sanitized.length >= MAX_HISTORY_TURNS) break;
  }
  return sanitized;
}

export const MAX_HISTORY_TURNS_FOR_TESTS = MAX_HISTORY_TURNS;
