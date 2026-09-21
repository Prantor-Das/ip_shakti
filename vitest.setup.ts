import { vi } from 'vitest';

vi.mock('server-only', () => ({}));

Object.assign(process.env, {
  NODE_ENV: 'test',
  GEMINI_API_KEY: 'test-key',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
});
