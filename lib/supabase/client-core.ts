import { createClient } from '@supabase/supabase-js';

export function assertServiceRoleKey(key: string): void {
  if (key.startsWith('sb_publishable_') || key.startsWith('sb_anon_')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY contains a publishable/anon key. Copy the server-only service_role key from Supabase Project Settings > API.'
    );
  }
  if (key.split('.').length === 3) {
    try {
      const payload = JSON.parse(
        Buffer.from(key.split('.')[1], 'base64url').toString('utf8')
      ) as unknown;
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'role' in payload &&
        payload.role !== 'service_role'
      ) {
        throw new Error(
          'SUPABASE_SERVICE_ROLE_KEY is a JWT for a non-service role. Copy the server-only service_role key from Supabase Project Settings > API.'
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.startsWith('SUPABASE_SERVICE_ROLE_KEY'))
        throw error;
    }
  }
}

export function createServiceClient(url: string, key: string) {
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
