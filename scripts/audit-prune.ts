import { createServiceClient } from '@/lib/supabase/client-core';
import { env } from '@/lib/env-core';

function daysFromArgs(): number {
  const index = process.argv.indexOf('--days');
  if (index < 0) return env.AUDIT_RETENTION_DAYS;
  const value = Number.parseInt(process.argv[index + 1] ?? '', 10);
  if (!Number.isInteger(value) || value <= 0) throw new Error('--days must be a positive integer');
  return value;
}

async function main() {
  const days = daysFromArgs();
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const supabase = createServiceClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('audit_log')
    .delete()
    .lt('timestamp', cutoff)
    .select('id');
  if (error) throw new Error(`Audit prune failed: ${error.code}`);
  console.info(
    `Deleted ${Array.isArray(data) ? data.length : 0} audit records older than ${days} days.`
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Audit prune failed');
  process.exitCode = 1;
});
