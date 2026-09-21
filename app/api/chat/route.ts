import { z } from 'zod';
import { answerQuestion } from '@/lib/rag/answer';
import type { ChatEvent } from '@/lib/chat/types';

export const runtime = 'nodejs';

const requestSchema = z
  .object({
    message: z.string().trim().min(1).max(2000),
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
          eventLine({ type: 'meta', requestId, jurisdiction: parsed.jurisdiction })
        );
        const firstUser = parsed.history.findIndex((item) => item.role === 'user');
        const history = firstUser === -1 ? [] : parsed.history.slice(firstUser);
        const result = await answerQuestion({ ...parsed, history, signal: request.signal });
        if (!request.signal.aborted) {
          controller.enqueue(eventLine({ type: 'delta', text: result.text }));
          controller.enqueue(
            eventLine({
              type: 'done',
              confidence: result.confidence,
              citations: result.citations,
              abstained: result.abstained,
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
