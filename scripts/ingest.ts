import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { config } from 'dotenv';
import { embedTextsWithApiKey } from '@/lib/ai/provider-core';
import { assertServiceRoleKey, createServiceClient } from '@/lib/supabase/client-core';

interface ManifestEntry {
  id: string;
  title: string;
  jurisdiction: 'india' | 'international';
  instrumentType:
    | 'act'
    | 'rules'
    | 'treaty'
    | 'regulation'
    | 'notification'
    | 'guideline'
    | 'case-law'
    | 'pharmacopoeia'
    | 'registry-info';
  citationLabel: string;
  version: string;
  asOfDate: string;
  sourceUrl: string;
  file: string;
}

interface ChunkDraft {
  sectionRef: string | null;
  heading: string | null;
  content: string;
  chunkIndex: number;
}

const root = resolve(process.cwd());
const embeddingBatchSize = 16;

config({ path: resolve(root, '.env.local') });
config({ path: resolve(root, '.env') });

function getIngestionSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for ingestion');
  assertServiceRoleKey(key);
  return createServiceClient(url, key);
}

function normalise(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitStructure(
  text: string
): Array<{ sectionRef: string | null; heading: string | null; text: string }> {
  const headingPattern =
    /^(Section|Article|Rule|Regulation)\s+([0-9]+[A-Za-z]?(?:\([^)]+\))?)(?:\s*[—:-]\s*|\s+)?(.*)$/gim;
  const matches = [...text.matchAll(headingPattern)];
  if (matches.length === 0) return [{ sectionRef: null, heading: null, text }];
  return matches.map((match, index) => ({
    sectionRef: `${match[1]} ${match[2]}`,
    heading: match[3]?.trim() || `${match[1]} ${match[2]}`,
    text: text.slice(match.index ?? 0, matches[index + 1]?.index ?? text.length).trim(),
  }));
}

function makeChunks(text: string): ChunkDraft[] {
  const chunks: ChunkDraft[] = [];
  let index = 0;
  for (const section of splitStructure(text)) {
    const words = section.text.split(/\s+/).filter(Boolean);
    const size = 600;
    const overlap = 100;
    for (let start = 0; start < words.length; start += size - overlap) {
      const content = words
        .slice(start, start + size)
        .join(' ')
        .trim();
      if (!content) continue;
      chunks.push({
        sectionRef: section.sectionRef,
        heading: section.heading,
        content,
        chunkIndex: index++,
      });
      if (start + size >= words.length) break;
    }
  }
  return chunks;
}

async function extractPdf(filePath: string): Promise<string> {
  const parser = new PDFParse({ data: await readFile(filePath) });
  const result = await parser.getText();
  await parser.destroy();
  return normalise(result.text);
}

async function withEmbeddingRetry(texts: string[], taskType: string): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is required for ingestion');
  let delay = 2000;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await embedTextsWithApiKey(apiKey, texts, taskType);
    } catch (error: unknown) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
      if (status !== 429 || attempt === 5) throw error;
      console.warn(`  [Rate Limit 429] Retrying in ${delay / 1000}s (attempt ${attempt + 1}/6)...`);
      await new Promise((resolvePromise) => setTimeout(resolvePromise, delay));
      delay *= 2;
    }
  }
  throw new Error('Embedding retry loop ended unexpectedly');
}

async function ingest(
  entry: ManifestEntry
): Promise<{ id: string; status: string; chunks: number }> {
  const filePath = resolve(root, 'corpus', entry.file);
  const bytes = await readFile(filePath);
  const checksum = createHash('sha256').update(bytes).digest('hex');
  const supabase = getIngestionSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from('corpus_documents')
    .select('id, checksum, status')
    .eq('slug', entry.id)
    .order('ingested_at', { ascending: false })
    .limit(1);
  if (existingError) throw existingError;
  const current = Array.isArray(existing) ? (existing[0] as unknown) : undefined;
  const currentRecord =
    typeof current === 'object' && current !== null ? (current as Record<string, unknown>) : null;
  if (currentRecord?.checksum === checksum && currentRecord.status === 'active')
    return { id: entry.id, status: 'skipped', chunks: 0 };

  const text = await extractPdf(filePath);
  const drafts = makeChunks(text);
  const { data: inserted, error: documentError } = await supabase
    .from('corpus_documents')
    .insert({
      slug: entry.id,
      title: entry.title,
      jurisdiction: entry.jurisdiction,
      instrument_type: entry.instrumentType,
      citation_label: entry.citationLabel,
      version: entry.version,
      as_of_date: entry.asOfDate,
      source_url: entry.sourceUrl,
      checksum,
      status: 'active',
    })
    .select('id')
    .single();
  if (documentError || !inserted)
    throw documentError ?? new Error('Could not insert corpus document');
  const document = inserted as unknown as { id: string };
  if (currentRecord) {
    const oldId = currentRecord.id;
    if (typeof oldId === 'string') {
      const { error: supersedeError } = await supabase
        .from('corpus_documents')
        .update({ status: 'superseded' })
        .eq('id', oldId);
      if (supersedeError) throw supersedeError;
    }
  }
  console.log(`Ingesting ${entry.id} (${drafts.length} chunks)...`);
  for (let start = 0; start < drafts.length; start += embeddingBatchSize) {
    const batch = drafts.slice(start, start + embeddingBatchSize);
    const embeddings = await withEmbeddingRetry(
      batch.map((chunk) => chunk.content),
      'RETRIEVAL_DOCUMENT'
    );
    if (embeddings.length !== batch.length)
      throw new Error(`Embedding count mismatch for ${entry.id}`);
    const rows = batch.map((chunk, index) => ({
      document_id: document.id,
      jurisdiction: entry.jurisdiction,
      section_ref: chunk.sectionRef,
      heading: chunk.heading,
      content: chunk.content,
      chunk_index: chunk.chunkIndex,
      embedding: embeddings[index],
    }));
    const { error: chunkError } = await supabase.from('corpus_chunks').insert(rows);
    if (chunkError) throw chunkError;
    if ((start + 1) % 10 === 0 || start + 1 === drafts.length) {
      console.log(`  Processed ${start + 1}/${drafts.length} chunks...`);
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  return { id: entry.id, status: 'ingested', chunks: drafts.length };
}

async function main() {
  const onlyIndex = process.argv.indexOf('--only');
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : undefined;
  const manifest = JSON.parse(
    await readFile(resolve(root, 'corpus/manifest.json'), 'utf8')
  ) as ManifestEntry[];
  const entries = only ? manifest.filter((entry) => entry.id === only) : manifest;
  if (entries.length === 0)
    throw new Error(only ? `Manifest entry not found: ${only}` : 'Manifest is empty');
  const results = [];
  for (const entry of entries) results.push(await ingest(entry));
  console.table(results);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
