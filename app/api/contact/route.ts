import 'server-only';

import nodemailer from 'nodemailer';
import { z } from 'zod';
import { env } from '@/lib/env';
import { checkRateLimit, estimatedTokens } from '@/lib/security/rate-limit';
import { readStrictJson, parseStrict } from '@/lib/security/request';
import { publicMessage } from '@/lib/security/errors';
import { sanitizeUserText } from '@/lib/security/text';

export const runtime = 'nodejs';
export const maxDuration = 15;

const requestSchema = z
  .object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(320),
    message: z.string().min(1).max(5000),
    website: z.string().max(0).default(''),
    formStartedAt: z.number().int().positive(),
  })
  .strict();

function headerField(value: string): string {
  return sanitizeUserText(value).replace(/[\r\n]/g, '');
}

function failure(requestId: string, status = 503): Response {
  return Response.json({ error: publicMessage('upstream-unavailable'), requestId }, { status });
}

async function sendWithResend(
  name: string,
  email: string,
  message: string,
  signal: AbortSignal
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `IP-SAKTI contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });
  if (!response.ok) throw new Error('contact_provider_failed');
}

async function sendWithSmtp(name: string, email: string, message: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `IP-SAKTI contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const body = await readStrictJson(request);
  if (body.response) return body.response;
  const parsed = parseStrict(body.value, requestSchema);
  if (parsed.response) return parsed.response;
  const input = parsed.value;
  if (!input || input.website || Date.now() - input.formStartedAt < 800)
    return Response.json({ error: 'Please wait and try again.', requestId }, { status: 400 });
  const name = headerField(input.name);
  const email = headerField(input.email);
  const message = sanitizeUserText(input.message).slice(0, 5000);
  const limit = await checkRateLimit(request, 'contact', estimatedTokens(message));
  if (!limit.ok) {
    return new Response(
      JSON.stringify({
        error:
          limit.code === 'budget-exhausted'
            ? publicMessage('budget-exhausted')
            : publicMessage('rate-limited'),
        requestId,
      }),
      {
        status: limit.code === 'budget-exhausted' ? 503 : 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfter) },
      }
    );
  }
  try {
    if (!env.CONTACT_PROVIDER || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL)
      throw new Error('contact_provider_not_configured');
    if (env.CONTACT_PROVIDER === 'resend')
      await sendWithResend(name, email, message, request.signal);
    else await sendWithSmtp(name, email, message);
    return Response.json({ ok: true, requestId });
  } catch (error: unknown) {
    console.error('Contact delivery failed', {
      requestId,
      error: error instanceof Error ? error.name : 'unknown_error',
    });
    return failure(requestId);
  } finally {
    await limit.release();
  }
}
