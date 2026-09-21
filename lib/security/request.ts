import 'server-only';

import { z } from 'zod';
import { env } from '@/lib/env';

export const MAX_BODY_BYTES = 16 * 1024;

function sameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return false;
  const origin = request.headers.get('origin');
  if (!origin) return fetchSite === 'same-origin' || env.NODE_ENV !== 'production';
  try {
    const actual = new URL(origin).origin;
    const allowed = new URL(env.NEXT_PUBLIC_SITE_URL).origin;
    if (actual === allowed) return true;
    return (
      env.NODE_ENV !== 'production' &&
      (actual === 'http://localhost:3000' || actual === 'http://127.0.0.1:3000')
    );
  } catch {
    return false;
  }
}

export function rejectResponse(message: string, status: 400 | 403 | 413 | 415): Response {
  return Response.json({ error: message }, { status });
}

export async function readStrictJson(
  request: Request
): Promise<{ value?: unknown; response?: Response }> {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json')
    return { response: rejectResponse('Content-Type must be application/json.', 415) };
  if (!sameOrigin(request))
    return { response: rejectResponse('Request origin is not allowed.', 403) };
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && Number.parseInt(declaredLength, 10) > MAX_BODY_BYTES)
    return { response: rejectResponse('Request body is too large.', 413) };
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_BODY_BYTES)
    return { response: rejectResponse('Request body is too large.', 413) };
  try {
    return { value: JSON.parse(new TextDecoder().decode(body)) as unknown };
  } catch {
    return { response: rejectResponse('Invalid JSON body.', 400) };
  }
}

export function parseStrict<T>(
  value: unknown,
  schema: z.ZodType<T>
): { value?: T; response?: Response } {
  const result = schema.safeParse(value);
  return result.success
    ? { value: result.data }
    : { response: Response.json({ error: 'Invalid request.' }, { status: 400 }) };
}
