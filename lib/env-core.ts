import { z } from 'zod';
import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

loadDotenv({ path: resolve(process.cwd(), '.env.local') });
loadDotenv({ path: resolve(process.cwd(), '.env') });

const optionalSecret = z.string().trim().min(1).optional();
const booleanEnv = z.preprocess((value) => {
  if (value === undefined) return undefined;
  return value === 'true' || value === '1';
}, z.boolean().default(false));

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    GEMINI_API_KEY: z.string().trim().min(1),
    GEMINI_MODEL: z.string().trim().min(1).default('gemini-3.8-flash'),
    GEMINI_FALLBACK_MODEL: z.string().trim().min(1).default('gemini-3.5-flash-lite'),
    GEMINI_TRANSLATION_MODEL: z.string().trim().min(1).default('gemini-3.8-flash'),
    GEMINI_EMBEDDING_MODEL: z.string().trim().min(1).default('gemini-embedding-001'),
    EMBEDDING_DIM: z.coerce.number().int().positive().default(768),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
    BHASHINI_USER_ID: optionalSecret,
    BHASHINI_ULCA_API_KEY: optionalSecret,
    BHASHINI_PIPELINE_ID: optionalSecret,
    RETRIEVAL_MIN_SIMILARITY: z.coerce.number().min(0).max(1).default(0.55),
    RETRIEVAL_HIGH_SIMILARITY: z.coerce.number().min(0).max(1).default(0.78),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
    MAX_OUTPUT_TOKENS: z.coerce.number().int().min(128).max(8192).default(4096),
    RATE_LIMIT_SALT: optionalSecret,
    CHAT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(10),
    CHAT_RATE_LIMIT_PER_DAY: z.coerce.number().int().positive().default(100),
    CONTACT_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(3),
    MAX_INFLIGHT_PER_CLIENT: z.coerce.number().int().min(1).max(2).default(1),
    DAILY_BUDGET_REQUESTS: z.coerce.number().int().positive().default(1000),
    DAILY_BUDGET_TOKENS: z.coerce.number().int().positive().default(1000000),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: optionalSecret,
    AUDIT_SALT: optionalSecret,
    LOG_CONTENT: booleanEnv,
    AUDIT_RETENTION_DAYS: z.coerce.number().int().positive().default(90),
    CONTACT_PROVIDER: z.enum(['resend', 'smtp']).optional(),
    CONTACT_TO_EMAIL: z.string().email().optional(),
    CONTACT_FROM_EMAIL: z.string().email().optional(),
    RESEND_API_KEY: optionalSecret,
    SMTP_HOST: optionalSecret,
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
    SMTP_USER: optionalSecret,
    SMTP_PASSWORD: optionalSecret,
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
    NEXT_PUBLIC_FACILITATOR_EMAIL: z.string().email().optional(),
    NEXT_PUBLIC_ENABLE_VOICE: booleanEnv,
  })
  .superRefine((values, context) => {
    const bhashini = [
      values.BHASHINI_USER_ID,
      values.BHASHINI_ULCA_API_KEY,
      values.BHASHINI_PIPELINE_ID,
    ];
    if (bhashini.some(Boolean) && !bhashini.every(Boolean))
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BHASHINI_*'],
        message: 'set all Bhashini credentials together',
      });
    if (Boolean(values.UPSTASH_REDIS_REST_URL) !== Boolean(values.UPSTASH_REDIS_REST_TOKEN))
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['UPSTASH_REDIS_*'],
        message: 'set both Upstash REST variables together',
      });
    if (
      values.CONTACT_PROVIDER === 'resend' &&
      (!values.RESEND_API_KEY || !values.CONTACT_TO_EMAIL || !values.CONTACT_FROM_EMAIL)
    )
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CONTACT_PROVIDER'],
        message: 'Resend requires RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL',
      });
    if (
      values.CONTACT_PROVIDER === 'smtp' &&
      (!values.SMTP_HOST ||
        !values.SMTP_PORT ||
        !values.SMTP_USER ||
        !values.SMTP_PASSWORD ||
        !values.CONTACT_TO_EMAIL ||
        !values.CONTACT_FROM_EMAIL)
    )
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CONTACT_PROVIDER'],
        message:
          'SMTP requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL',
      });
  });

export type Env = z.infer<typeof schema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = schema.safeParse(source);
  if (result.success) return result.data;
  const issues = result.error.issues.map(
    (issue) => `- ${issue.path.join('.') || 'environment'}: ${issue.message}`
  );
  throw new Error(`Environment configuration is invalid:\n${issues.join('\n')}`);
}

export const env = parseEnv(process.env);
