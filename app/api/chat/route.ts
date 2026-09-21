import { z } from 'zod';
import { answerQuestion } from '@/lib/rag/answer';
import type { ChatEvent } from '@/lib/chat/types';
import { isLanguage, type Language } from '@/lib/i18n/languages';
import { translateText } from '@/lib/translate';

export const runtime = 'nodejs';

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
  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(
          eventLine({
            type: 'meta',
            requestId,
            jurisdiction: parsed.jurisdiction,
            lang: parsed.lang,
          })
        );
        const firstUser = parsed.history.findIndex((item) => item.role === 'user');
        const history = firstUser === -1 ? [] : parsed.history.slice(firstUser);
        let message = parsed.message;
        if (parsed.lang !== 'en') {
          controller.enqueue(eventLine({ type: 'status', stage: 'translating' }));
          message = (await translateText(parsed.message, parsed.lang, 'en')).text;
        }
        const result = await answerQuestion({
          ...parsed,
          message,
          history: parsed.lang === 'en' ? history : [],
          signal: request.signal,
          onDelta:
            parsed.lang === 'en'
              ? (text) => controller.enqueue(eventLine({ type: 'delta', text }))
              : undefined,
        });
        if (!request.signal.aborted) {
          const disclaimer = 'This is information, not legal advice.';
          const answerBody = result.text.endsWith(disclaimer)
            ? result.text.slice(0, -disclaimer.length).trimEnd()
            : result.text;
          let displayText = parsed.lang === 'en' ? result.text : answerBody;
          let translationFailed = false;
          if (parsed.lang !== 'en') {
            controller.enqueue(eventLine({ type: 'status', stage: 'translating' }));
            const translated = await translateText(answerBody, 'en', parsed.lang);
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
        console.error('Error in /api/chat route:', error);
        controller.enqueue(eventLine({ type: 'error', code: 'provider_unavailable' }));
        controller.close();
      }
    },
  });
  return new Response(readable, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache' },
  });
}
