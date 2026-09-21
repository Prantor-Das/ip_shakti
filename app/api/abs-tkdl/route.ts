import { z } from 'zod';
import { answerQuestion } from '@/lib/rag/answer';
import { readStrictJson, parseStrict } from '@/lib/security/request';
import { sanitizeUserText } from '@/lib/security/text';
import { checkRateLimit, clientIdentifier, estimatedTokens } from '@/lib/security/rate-limit';
import { errorStatus, mapError, publicMessage, type ApiErrorCode } from '@/lib/security/errors';
import { writeAuditRecord } from '@/lib/audit';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

const requestSchema = z
  .object({
    person: z.enum([
      'indian-citizen-entity',
      'foreign-entity',
      'ayush-practitioner',
      'codified-tk-user',
    ]),
    access: z.enum([
      'wild-biological-resource',
      'cultivated-medicinal-plant',
      'associated-traditional-knowledge',
      'imported-material',
    ]),
    purpose: z.enum([
      'research',
      'commercial-utilisation',
      'applying-for-an-ipr',
      'transfer-of-results',
    ]),
    stage: z.enum([
      'considering-access',
      'accessed-research-underway',
      'commercialisation-or-filing',
    ]),
  })
  .strict();

const labels: Record<z.infer<typeof requestSchema>[keyof z.infer<typeof requestSchema>], string> = {
  'indian-citizen-entity': 'Indian citizen or entity',
  'foreign-entity': 'foreign entity',
  'ayush-practitioner': 'AYUSH practitioner',
  'codified-tk-user': 'codified traditional-knowledge user',
  'wild-biological-resource': 'wild-collected biological resource',
  'cultivated-medicinal-plant': 'cultivated medicinal plant',
  'associated-traditional-knowledge': 'associated traditional knowledge',
  'imported-material': 'imported material',
  research: 'research',
  'commercial-utilisation': 'commercial utilisation',
  'applying-for-an-ipr': 'applying for an intellectual-property right',
  'transfer-of-results': 'transfer of results or third-party transfer',
  'considering-access': 'considering access',
  'accessed-research-underway': 'accessed or research is underway',
  'commercialisation-or-filing': 'commercialisation or filing stage',
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const body = await readStrictJson(request);
  if (body.response) return body.response;
  const parsedBody = parseStrict(body.value, requestSchema);
  if (parsedBody.response) return parsedBody.response;
  const parsed = parsedBody.value;
  if (!parsed) return Response.json({ error: 'Invalid request.', requestId }, { status: 400 });

  const question = [
    'Using only the active India corpus, identify the corpus-backed ABS, biological-resource, traditional-knowledge, and IP questions raised by these facts.',
    `Who I am: ${labels[parsed.person]}.`,
    `What I am accessing: ${labels[parsed.access]}.`,
    `Purpose: ${labels[parsed.purpose]}.`,
    `Stage: ${labels[parsed.stage]}.`,
    'Separate what the cited sources establish from what they do not cover. Do not infer a legal conclusion or mention an amendment, rule, form, authority, or date unless it appears in the cited sources. Cite every factual statement with [S#] markers.',
  ].join('\n');

  const limit = await checkRateLimit(request, 'chat', estimatedTokens(question));
  if (!limit.ok) {
    const code: ApiErrorCode = limit.code;
    return new Response(JSON.stringify({ error: publicMessage(code), requestId }), {
      status: errorStatus(code),
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfter) },
    });
  }
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(env.REQUEST_TIMEOUT_MS)]);
  const startedAt = Date.now();
  try {
    const result = await answerQuestion({
      message: sanitizeUserText(question),
      jurisdiction: 'india',
      history: [],
      signal,
    });
    await writeAuditRecord({
      requestId,
      clientId: clientIdentifier(request),
      jurisdiction: 'india',
      lang: 'en',
      retrievedDocIds: result.retrievedDocIds,
      citedDocIds: result.citations.flatMap((citation) =>
        citation.documentId ? [citation.documentId] : []
      ),
      confidence: result.confidence,
      abstained: result.abstained,
      model: env.GEMINI_MODEL,
      latencyMs: Date.now() - startedAt,
      inputTokens: result.inputTokenCount,
      outputTokens: result.outputTokenCount,
      questionText: question,
      answerText: result.text,
    });
    return Response.json({ ...result, question, requestId });
  } catch (error: unknown) {
    const code = mapError(error);
    console.error('ABS/TKDL helper failed', { requestId, errorCode: code });
    return Response.json({ error: publicMessage(code), requestId }, { status: errorStatus(code) });
  } finally {
    await limit.release();
  }
}
