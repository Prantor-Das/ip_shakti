import 'server-only';

import { embedTexts } from '@/lib/ai/provider';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import type { Jurisdiction } from '@/lib/chat/types';
import { env } from '@/lib/env';

export interface RetrievedChunk {
  id: string;
  documentId: string;
  jurisdiction: Jurisdiction;
  sectionRef: string | null;
  heading: string | null;
  content: string;
  chunkIndex: number;
  similarity: number;
  title: string;
  citationLabel: string;
  version: string;
  asOfDate: string;
  sourceUrl: string;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  minSimilarity: number;
  topSimilarity: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

function mapRow(value: unknown): RetrievedChunk | null {
  const row = asRecord(value);
  if (!row) return null;
  const jurisdiction = stringValue(row.jurisdiction);
  if (jurisdiction !== 'india' && jurisdiction !== 'international') return null;
  const id = stringValue(row.id);
  const documentId = stringValue(row.document_id);
  if (!id || !documentId || !stringValue(row.content)) return null;
  return {
    id,
    documentId,
    jurisdiction,
    sectionRef: typeof row.section_ref === 'string' ? row.section_ref : null,
    heading: typeof row.heading === 'string' ? row.heading : null,
    content: stringValue(row.content),
    chunkIndex: numberValue(row.chunk_index),
    similarity: numberValue(row.similarity),
    title: stringValue(row.title),
    citationLabel: stringValue(row.citation_label),
    version: stringValue(row.version),
    asOfDate: stringValue(row.as_of_date),
    sourceUrl: stringValue(row.source_url),
  };
}

function explicitSection(query: string): string | null {
  const match = query.match(/\b(?:section|article|rule|regulation)\s+([0-9]+(?:\([a-z0-9]+\))?)/i);
  return match?.[1] ?? null;
}

export async function retrieve(
  query: string,
  jurisdiction: Jurisdiction,
  signal?: AbortSignal
): Promise<RetrievalResult> {
  const minSimilarity = env.RETRIEVAL_MIN_SIMILARITY;
  const [embedding] = await embedTexts([query], 'RETRIEVAL_QUERY', signal);
  if (!embedding || embedding.length !== env.EMBEDDING_DIM)
    throw new Error('Embedding dimension mismatch');

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: embedding,
    p_jurisdiction: jurisdiction,
    p_count: 6,
    p_min_similarity: minSimilarity,
  });
  if (error) throw error;
  const primary = (Array.isArray(data) ? data : [])
    .map(mapRow)
    .filter((row): row is RetrievedChunk => row !== null);

  const section = explicitSection(query);
  if (section) {
    const { data: sectionData, error: sectionError } = await supabase
      .from('corpus_chunks')
      .select(
        'id, document_id, jurisdiction, section_ref, heading, content, chunk_index, corpus_documents!inner(title, citation_label, version, as_of_date, source_url, status, jurisdiction)'
      )
      .eq('jurisdiction', jurisdiction)
      .ilike('section_ref', `%${section}%`)
      .eq('corpus_documents.status', 'active')
      .eq('corpus_documents.jurisdiction', jurisdiction)
      .limit(6);
    if (sectionError) throw sectionError;
    const explicit = (Array.isArray(sectionData) ? sectionData : [])
      .map((row) => {
        const record = asRecord(row);
        const document = record ? asRecord(record.corpus_documents) : null;
        return record && document ? mapRow({ ...record, ...document }) : null;
      })
      .filter((row): row is RetrievedChunk => row !== null);
    const merged = new Map(primary.map((row) => [row.id, row]));
    for (const row of explicit) if (row.similarity >= minSimilarity) merged.set(row.id, row);
    const chunks = [...merged.values()].sort((a, b) => b.similarity - a.similarity).slice(0, 6);
    return { chunks, minSimilarity, topSimilarity: chunks[0]?.similarity ?? 0 };
  }
  return { chunks: primary, minSimilarity, topSimilarity: primary[0]?.similarity ?? 0 };
}
