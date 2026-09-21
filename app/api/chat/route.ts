import { z } from 'zod';
import { answerQuestion } from '@/lib/rag/answer';
import type { ChatEvent } from '@/lib/chat/types';
import { isLanguage, type Language } from '@/lib/i18n/languages';
import { translateText } from '@/lib/translate';
import { env } from '@/lib/env';
import { checkRateLimit, clientIdentifier, estimatedTokens } from '@/lib/security/rate-limit';
import { readStrictJson, parseStrict } from '@/lib/security/request';
import { sanitizeHistory, sanitizeUserText } from '@/lib/security/text';
import { errorStatus, mapError, publicMessage, type ApiErrorCode } from '@/lib/security/errors';
import { writeAuditRecord } from '@/lib/audit';
import type { AnswerResult } from '@/lib/rag/answer';
import { getSamhitaContextTopic, samhitaContextText } from '@/lib/samhita-context';

export const runtime = 'nodejs';
export const maxDuration = 30;

const requestSchema = z
  .object({
    message: z.string().trim().min(1).max(2000),
    lang: z.custom<Language>(
      (value: unknown): value is Language => typeof value === 'string' && isLanguage(value)
    ),
    jurisdiction: z.enum(['india', 'international']),
    formulationType: z
      .enum([
        'classical',
        'proprietary',
        'new-drug',
        'phytopharmaceutical',
        'nutraceutical',
        'cosmetic',
        'unsure',
      ])
      .optional(),
    contextTopic: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .max(120)
      .optional(),
    history: z
      .array(
        z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2000) }).strict()
      )
      .max(10),
  })
  .strict();

function eventLine(event: ChatEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const body = await readStrictJson(request);
  if (body.response) return body.response;
  const parsedBody = parseStrict(body.value, requestSchema);
  if (parsedBody.response) return parsedBody.response;
  const parsed = parsedBody.value;
  if (!parsed) return Response.json({ error: 'Invalid request.', requestId }, { status: 400 });
  const message = sanitizeUserText(parsed.message);
  const history = sanitizeHistory(parsed.history);
  const contextTopic = getSamhitaContextTopic(parsed.contextTopic);
  const contextMessage = contextTopic
    ? `${samhitaContextText(contextTopic)}\n\n${message}`
    : message;
  const limit = await checkRateLimit(
    request,
    'chat',
    estimatedTokens(contextMessage + history.map((item) => item.content).join(''))
  );
  if (!limit.ok) {
    const code: ApiErrorCode = limit.code;
    return new Response(JSON.stringify({ error: publicMessage(code), requestId }), {
      status: errorStatus(code),
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfter) },
    });
  }
  const timeoutSignal = AbortSignal.timeout(env.REQUEST_TIMEOUT_MS);
  const signal = AbortSignal.any([request.signal, timeoutSignal]);
  const startedAt = Date.now();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let result: AnswerResult | undefined;
      let errorCode: string | undefined;
      try {
        controller.enqueue(
          eventLine({
            type: 'meta',
            requestId,
            jurisdiction: parsed.jurisdiction,
            lang: parsed.lang,
          })
        );
        let englishMessage = contextMessage;
        if (parsed.lang !== 'en') {
          controller.enqueue(eventLine({ type: 'status', stage: 'translating' }));
          englishMessage = (await translateText(message, parsed.lang, 'en', signal)).text;
        }
        result = await answerQuestion({
          ...parsed,
          message: englishMessage,
          history: parsed.lang === 'en' ? history : [],
          signal,
          onDelta:
            parsed.lang === 'en'
              ? (text) => {
                  if (!signal.aborted) controller.enqueue(eventLine({ type: 'delta', text }));
                }
              : undefined,
        });
        if (!signal.aborted) {
          const disclaimer = 'This is information, not legal advice.';
          const answerBody = result.text.endsWith(disclaimer)
            ? result.text.slice(0, -disclaimer.length).trimEnd()
            : result.text;
          let displayText = parsed.lang === 'en' ? result.text : answerBody;
          let translationFailed = false;
          if (parsed.lang !== 'en') {
            controller.enqueue(eventLine({ type: 'status', stage: 'translating' }));
            const translated = await translateText(answerBody, 'en', parsed.lang, signal);
            displayText = translated.text;
            translationFailed = translated.translationFailed;
          }
          if (parsed.lang !== 'en')
            controller.enqueue(eventLine({ type: 'delta', text: displayText }));
          controller.enqueue(
            eventLine({
              type: 'done',
              confidence: result.confidence,
              citations: result.citations,
              abstained: result.abstained,
              lang: parsed.lang,
              translated: parsed.lang !== 'en' && !translationFailed,
              translationFailed,
              englishText: result.text,
            })
          );
          controller.close();
        }
      } catch (error: unknown) {
        if (request.signal.aborted) {
          controller.close();
          return;
        }
        errorCode = mapError(error);
        console.error('Chat request failed', { requestId, errorCode });
        controller.enqueue(eventLine({ type: 'error', code: errorCode, requestId }));
        controller.close();
      } finally {
        await writeAuditRecord({
          requestId,
          clientId: clientIdentifier(request),
          jurisdiction: parsed.jurisdiction,
          lang: parsed.lang,
          formulationType: parsed.formulationType,
          retrievedDocIds: result?.retrievedDocIds ?? [],
          citedDocIds:
            result?.citations.flatMap((citation) =>
              citation.documentId ? [citation.documentId] : []
            ) ?? [],
          confidence: result?.confidence,
          abstained: result?.abstained ?? false,
          model: env.GEMINI_MODEL,
          latencyMs: Date.now() - startedAt,
          inputTokens: result?.inputTokenCount ?? estimatedTokens(message),
          outputTokens: result?.outputTokenCount ?? 0,
          errorCode,
          questionText: message,
          answerText: result?.text,
        });
        await limit.release();
      }
    },
  });
  return new Response(readable, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache' },
  });
}
