import { config } from 'dotenv';
import { resolve } from 'node:path';
import { assertServiceRoleKey, createServiceClient } from '@/lib/supabase/client-core';

const root = resolve(process.cwd());
config({ path: resolve(root, '.env.local') });
config({ path: resolve(root, '.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
assertServiceRoleKey(key);
const supabase = createServiceClient(url, key);

function describeError(error: {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
}): string {
  return JSON.stringify({
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

async function main() {
  // Use a normal GET here. PostgREST can return an empty error object for HEAD
  // requests when the schema cache or proxy strips the response metadata.
  const documents = await supabase.from('corpus_documents').select('id').limit(1);
  const chunks = await supabase.from('corpus_chunks').select('id').limit(1);
  if (documents.error?.code === 'PGRST205' || chunks.error?.code === 'PGRST205')
    throw new Error(
      'Corpus schema is missing. Apply supabase/migrations/202609210001_corpus.sql with `supabase db push` or the SQL editor.'
    );
  if (documents.error)
    throw new Error(`corpus_documents check failed: ${describeError(documents.error)}`);
  if (chunks.error) throw new Error(`corpus_chunks check failed: ${describeError(chunks.error)}`);
  const probeVector = `[${Array.from({ length: 768 }, (_, index) => (index === 0 ? '1' : '0')).join(',')}]`;
  const rpc = await supabase.rpc('match_chunks', {
    query_embedding: probeVector,
    p_jurisdiction: 'india',
    p_count: 1,
    p_min_similarity: 1,
  });
  if (rpc.error)
    throw new Error(
      `match_chunks RPC is unavailable: ${JSON.stringify({ code: rpc.error.code, message: rpc.error.message, details: rpc.error.details, hint: rpc.error.hint })}`
    );
  console.table([
    { component: 'corpus_documents', status: 'ok', rows: 'reachable' },
    { component: 'corpus_chunks', status: 'ok', rows: 'reachable' },
    {
      component: 'match_chunks RPC',
      status: 'ok',
      rows: Array.isArray(rpc.data) ? rpc.data.length : 0,
    },
  ]);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
