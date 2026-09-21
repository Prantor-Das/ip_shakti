import 'server-only';

import { assertServiceRoleKey, createServiceClient } from '@/lib/supabase/client-core';

export function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server configuration is missing');
  assertServiceRoleKey(key);
  return createServiceClient(url, key);
}
