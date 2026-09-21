import { z } from 'zod';
import { answerQuestion } from '@/lib/rag/answer';

export const runtime = 'nodejs';

const requestSchema = z.object({
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
});

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
  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Please complete each facts field.' }, { status: 400 });
  }

  const question = [
    'Using only the active India corpus, identify the corpus-backed ABS, biological-resource, traditional-knowledge, and IP questions raised by these facts.',
    `Who I am: ${labels[parsed.person]}.`,
    `What I am accessing: ${labels[parsed.access]}.`,
    `Purpose: ${labels[parsed.purpose]}.`,
    `Stage: ${labels[parsed.stage]}.`,
    'Separate what the cited sources establish from what they do not cover. Do not infer a legal conclusion or mention an amendment, rule, form, authority, or date unless it appears in the cited sources. Cite every factual statement with [S#] markers.',
  ].join('\n');

  try {
    const result = await answerQuestion({
      message: question,
      jurisdiction: 'india',
      history: [],
      signal: request.signal,
    });
    return Response.json({ ...result, question });
  } catch (error: unknown) {
    console.error(
      'ABS/TKDL helper failed',
      error instanceof Error ? error.message : 'unknown_error'
    );
    return Response.json(
      { error: 'The India corpus is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
