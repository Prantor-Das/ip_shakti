import 'server-only';

import { createHash } from 'node:crypto';
import { env } from '@/lib/env';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import type { Confidence, FormulationType, Jurisdiction } from '@/lib/chat/types';

export interface AuditRecord {
  requestId: string;
  clientId: string;
  jurisdiction: Jurisdiction;
  lang: string;
  formulationType?: FormulationType;
  retrievedDocIds: string[];
  citedDocIds: string[];
  confidence?: Confidence;
  abstained: boolean;
  model: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  errorCode?: string;
  questionText?: string;
  answerText?: string;
}

export function hashClientId(value: string): string {
  const salt = env.RATE_LIMIT_SALT ?? 'audit-process-salt';
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

export async function writeAuditRecord(record: AuditRecord): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();
    const row = {
      request_id: record.requestId,
      timestamp: new Date().toISOString(),
      client_id_hash: hashClientId(record.clientId),
      jurisdiction: record.jurisdiction,
      lang: record.lang,
      formulation_type: record.formulationType ?? null,
      retrieved_doc_ids: record.retrievedDocIds,
      cited_doc_ids: record.citedDocIds,
      confidence: record.confidence ?? null,
      abstained: record.abstained,
      model: record.model,
      latency_ms: record.latencyMs,
      input_tokens: record.inputTokens,
      output_tokens: record.outputTokens,
      error_code: record.errorCode ?? null,
      question_text: env.LOG_CONTENT ? (record.questionText ?? null) : null,
      answer_text: env.LOG_CONTENT ? (record.answerText ?? null) : null,
    };
    const { error } = await supabase.from('audit_log').insert(row);
    if (error) console.error('Audit log write failed', { code: error.code });
  } catch (error: unknown) {
    console.error('Audit log unavailable', {
      error: error instanceof Error ? error.name : 'unknown_error',
    });
  }
}
