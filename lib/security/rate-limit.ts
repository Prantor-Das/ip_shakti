import 'server-only';

import { createHash, randomUUID } from 'node:crypto';
import { env } from '@/lib/env';

type LimitKind = 'chat' | 'contact';
interface Bucket {
  count: number;
  resetAt: number;
}
export interface RateLimitDecision {
  ok: boolean;
  retryAfter: number;
  code: 'rate-limited' | 'budget-exhausted';
  release: () => Promise<void>;
}

const memory = new Map<string, Bucket>();
const inflight = new Map<string, number>();
const salt = env.RATE_LIMIT_SALT ?? randomUUID();
let warnedMemory = false;

function warnMemoryFallback(): void {
  if (warnedMemory || env.UPSTASH_REDIS_REST_URL) return;
  warnedMemory = true;
  console.warn(
    'Rate limiting is using in-memory storage and is NOT effective on serverless instances.'
  );
}

export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown-client';
  return ip;
}

function clientHash(request: Request): string {
  return createHash('sha256')
    .update(`${salt}:${clientIdentifier(request)}`)
    .digest('hex');
}

function nowBucket(key: string, windowSeconds: number): Bucket {
  const now = Date.now();
  const current = memory.get(key);
  if (current && current.resetAt > now) return current;
  const next = { count: 0, resetAt: now + windowSeconds * 1000 };
  memory.set(key, next);
  return next;
}

async function redisPipeline(commands: unknown[][]): Promise<unknown[] | null> {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    warnMemoryFallback();
    return null;
  }
  try {
    const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });
    if (!response.ok) throw new Error('redis_unavailable');
    const value = (await response.json()) as unknown;
    return Array.isArray(value) ? value : null;
  } catch {
    console.warn('Upstash rate-limit storage unavailable; using in-memory fallback.');
    return null;
  }
}

async function increment(
  key: string,
  windowSeconds: number,
  amount = 1
): Promise<{ count: number; retryAfter: number }> {
  const result = await redisPipeline([
    [amount === 1 ? 'INCR' : 'INCRBY', key, ...(amount === 1 ? [] : [amount])],
    ['EXPIRE', key, windowSeconds],
  ]);
  if (result) {
    const raw = result[0];
    const count =
      typeof raw === 'object' && raw !== null && 'result' in raw && typeof raw.result === 'number'
        ? raw.result
        : 0;
    return { count, retryAfter: windowSeconds };
  }
  const bucket = nowBucket(key, windowSeconds);
  bucket.count += amount;
  return {
    count: bucket.count,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - Date.now()) / 1000)),
  };
}

async function decrement(key: string): Promise<void> {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    await redisPipeline([['DECR', key]]);
    return;
  }
  const current = inflight.get(key) ?? 0;
  if (current <= 1) inflight.delete(key);
  else inflight.set(key, current - 1);
}

export function estimatedTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export async function checkRateLimit(
  request: Request,
  kind: LimitKind,
  tokenEstimate: number
): Promise<RateLimitDecision> {
  const id = clientHash(request);
  const day = new Date().toISOString().slice(0, 10);
  const limits =
    kind === 'chat'
      ? [
          { suffix: 'minute', seconds: 60, limit: env.CHAT_RATE_LIMIT_PER_MINUTE },
          { suffix: 'day', seconds: 86400, limit: env.CHAT_RATE_LIMIT_PER_DAY },
        ]
      : [{ suffix: 'hour', seconds: 3600, limit: env.CONTACT_RATE_LIMIT_PER_HOUR }];
  const globalRequests = await increment(`ip-sakti:global:requests:${day}`, 86400);
  const globalTokens = await increment(`ip-sakti:global:tokens:${day}`, 86400, tokenEstimate);
  if (
    globalRequests.count > env.DAILY_BUDGET_REQUESTS ||
    globalTokens.count > env.DAILY_BUDGET_TOKENS
  )
    return {
      ok: false,
      retryAfter: 86400,
      code: 'budget-exhausted',
      release: async () => undefined,
    };
  for (const limit of limits) {
    const result = await increment(`ip-sakti:${kind}:${id}:${limit.suffix}`, limit.seconds);
    if (result.count > limit.limit)
      return {
        ok: false,
        retryAfter: result.retryAfter,
        code: 'rate-limited',
        release: async () => undefined,
      };
  }
  const inflightKey = `ip-sakti:inflight:${id}`;
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const result = await increment(inflightKey, 120);
    if (result.count > env.MAX_INFLIGHT_PER_CLIENT) {
      await decrement(inflightKey);
      return { ok: false, retryAfter: 2, code: 'rate-limited', release: async () => undefined };
    }
  } else {
    warnMemoryFallback();
    const current = inflight.get(inflightKey) ?? 0;
    if (current >= env.MAX_INFLIGHT_PER_CLIENT)
      return { ok: false, retryAfter: 2, code: 'rate-limited', release: async () => undefined };
    inflight.set(inflightKey, current + 1);
  }
  return {
    ok: true,
    retryAfter: 0,
    code: 'rate-limited',
    release: async () => decrement(inflightKey),
  };
}
