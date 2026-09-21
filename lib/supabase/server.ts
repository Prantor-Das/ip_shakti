import 'server-only';

import { assertServiceRoleKey, createServiceClient } from '@/lib/supabase/client-core';
import { env } from '@/lib/env';

export function getSupabaseServiceClient() {
  assertServiceRoleKey(env.SUPABASE_SERVICE_ROLE_KEY);
  return createServiceClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
