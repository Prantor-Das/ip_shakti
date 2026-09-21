import Link from 'next/link';
import { ExternalLinkIcon, FileTextIcon } from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export const revalidate = 3600;

type Jurisdiction = 'india' | 'international';
interface DocumentRow {
  id: string;
  title: string;
  jurisdiction: Jurisdiction;
  instrument_type: string;
  version: string;
  as_of_date: string;
  source_url: string;
  ingested_at: string;
}
interface ChunkRow {
  document_id: string;
}
interface CorpusDocument extends DocumentRow {
  chunkCount: number;
}

async function getCorpus(): Promise<CorpusDocument[]> {
  try {
    const supabase = getSupabaseServiceClient();
    const { data: documents, error: documentError } = await supabase
      .from('corpus_documents')
      .select('id,title,jurisdiction,instrument_type,version,as_of_date,source_url,ingested_at')
      .eq('status', 'active')
      .order('jurisdiction')
      .order('title');
    if (documentError) throw documentError;
    const typedDocuments = (Array.isArray(documents) ? documents : []) as unknown as DocumentRow[];
    const { data: chunks, error: chunkError } = await supabase
      .from('corpus_chunks')
      .select('document_id, corpus_documents!inner(status)')
      .eq('corpus_documents.status', 'active');
    if (chunkError) throw chunkError;
    const counts = new Map<string, number>();
    for (const chunk of (Array.isArray(chunks) ? chunks : []) as unknown as ChunkRow[])
      counts.set(chunk.document_id, (counts.get(chunk.document_id) ?? 0) + 1);
    return typedDocuments.map((document) => ({
      ...document,
      chunkCount: counts.get(document.id) ?? 0,
    }));
  } catch (error: unknown) {
    console.error(
      'Corpus status unavailable',
      error instanceof Error ? error.message : 'unknown_error'
    );
    return [];
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(value)
  );
}

export default async function SourcesPage() {
  const documents = await getCorpus();
  const totals = (['india', 'international'] as const).map((jurisdiction) => ({
    jurisdiction,
    documents: documents.filter((document) => document.jurisdiction === jurisdiction),
  }));
  return (
    <main className="min-h-dvh bg-[#f7faf7] px-4 pb-16 pt-28 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Evidence registry
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Corpus sources</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950/65">
              Active documents currently available to the retrieval pipeline, separated by
              jurisdiction.
            </p>
          </div>
          <Link href="/chat" className="text-sm font-semibold text-primary underline">
            Ask the assistant
          </Link>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {totals.map((total) => (
            <div
              key={total.jurisdiction}
              className="rounded-xl border border-emerald-900/10 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-950/55">
                {total.jurisdiction}
              </p>
              <p className="mt-2 text-2xl font-semibold">{total.documents.length} documents</p>
              <p className="mt-1 text-xs text-emerald-950/55">
                {total.documents.reduce((sum, document) => sum + document.chunkCount, 0)} indexed
                chunks
              </p>
            </div>
          ))}
        </div>
        {documents.length === 0 ? (
          <div className="mt-6 rounded-xl border border-amber-900/15 bg-amber-50 p-4 text-sm text-amber-950">
            Corpus status is unavailable until the server database is configured.
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {documents.map((document) => (
              <article
                key={document.id}
                className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                      <FileTextIcon className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">{document.title}</h2>
                      <p className="mt-1 text-xs text-emerald-950/55">
                        {document.jurisdiction} · {document.instrument_type}
                      </p>
                    </div>
                  </div>
                  <a
                    href={document.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline"
                  >
                    Official source <ExternalLinkIcon className="size-3.5" />
                  </a>
                </div>
                <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-4">
                  <div>
                    <dt className="text-emerald-950/50">Version</dt>
                    <dd className="mt-1 font-semibold">{document.version}</dd>
                  </div>
                  <div>
                    <dt className="text-emerald-950/50">As of</dt>
                    <dd className="mt-1 font-semibold">{formatDate(document.as_of_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-emerald-950/50">Chunks</dt>
                    <dd className="mt-1 font-semibold">{document.chunkCount}</dd>
                  </div>
                  <div>
                    <dt className="text-emerald-950/50">Last ingested</dt>
                    <dd className="mt-1 font-semibold">{formatDate(document.ingested_at)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
        <p className="mt-7 text-xs text-emerald-950/50">
          Counts are read from the active corpus records and may change after ingestion.
        </p>
      </div>
    </main>
  );
}
