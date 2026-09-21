import { mkdir, readFile, writeFile } from 'node:fs/promises';
import Module from 'node:module';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import type { AnswerResult } from '@/lib/rag/answer';
import type { ChatHistoryItem, FormulationType, Jurisdiction } from '@/lib/chat/types';

// The evaluator is a server-side CLI, but the published server-only package intentionally
// rejects raw Node imports. Bypass only that marker for this process; secret-reading modules
// remain server-only in the application bundle.
const moduleLoader = Module as unknown as {
  _load: (request: string, parent: object | null, isMain: boolean) => unknown;
};
const originalModuleLoad = moduleLoader._load;
moduleLoader._load = (request, parent, isMain) =>
  request === 'server-only' ? {} : originalModuleLoad(request, parent, isMain);

type EvalBehavior = 'answer' | 'abstain' | 'redirect';
type EvalQuestion = {
  id: string;
  category: string;
  question: string;
  lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';
  jurisdiction: Jurisdiction;
  formulationType?: FormulationType;
  history?: ChatHistoryItem[];
  expected: { behavior: EvalBehavior; docIds: string[]; mustInclude: string[] };
};
type QuestionRun = {
  id: string;
  category: string;
  expectedBehavior: EvalBehavior;
  actualBehavior: EvalBehavior;
  expectedDocIds: string[];
  retrievedDocIds: string[];
  citationDocIds: string[];
  citationValidity: boolean;
  jurisdictionLeakage: boolean;
  disclaimerPresent: boolean;
  mustIncludeCoverage: number;
  topSimilarity: number;
  latencyMs: number;
  todoDocIds: boolean;
  pass: boolean;
  error?: string;
};

const root = resolve(process.cwd());
config({ path: resolve(root, '.env.local') });
config({ path: resolve(root, '.env') });

function statusOf(error: unknown): unknown {
  return typeof error === 'object' && error !== null && 'status' in error
    ? error.status
    : undefined;
}

async function withBackoff<T>(operation: () => Promise<T>): Promise<T> {
  let delay = 1500;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await operation();
    } catch (error: unknown) {
      if (statusOf(error) !== 429 || attempt === 3) throw error;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, delay));
      delay *= 2;
    }
  }
  throw new Error('Evaluation retry loop ended unexpectedly');
}

function actualBehavior(result: AnswerResult): EvalBehavior {
  return result.abstained ? 'abstain' : 'answer';
}

function citationValidity(result: AnswerResult): boolean {
  const ids = new Set(result.citations.map((citation) => citation.id));
  return [...result.text.matchAll(/\[S(\d+)\]/g)].every((match) => ids.has(`S${match[1]}`));
}

async function runQuestion(question: EvalQuestion): Promise<QuestionRun> {
  const startedAt = Date.now();
  try {
    const [{ translateText }, { answerQuestion }] = await Promise.all([
      import('@/lib/translate'),
      import('@/lib/rag/answer'),
    ]);
    const translated =
      question.lang === 'en'
        ? { text: question.question, translationFailed: false }
        : await translateText(question.question, question.lang, 'en');
    const result = await withBackoff(() =>
      answerQuestion({
        message: translated.text,
        jurisdiction: question.jurisdiction,
        formulationType: question.formulationType,
        history: question.history ?? [],
      })
    );
    const actual = actualBehavior(result);
    const expectedDocIds = question.expected.docIds.filter((id) => id !== 'TODO');
    const citationDocIds = result.citations.flatMap((citation) =>
      citation.documentId ? [citation.documentId] : []
    );
    const mustIncludeCoverage =
      question.expected.mustInclude.length === 0
        ? 1
        : question.expected.mustInclude.filter((value) =>
            result.text.toLowerCase().includes(value.toLowerCase())
          ).length / question.expected.mustInclude.length;
    const todoDocIds = question.expected.docIds.includes('TODO');
    const behaviorPass =
      question.expected.behavior === 'answer' ? actual === 'answer' : actual === 'abstain';
    const docPass = todoDocIds || expectedDocIds.every((id) => citationDocIds.includes(id));
    const pass =
      !todoDocIds &&
      behaviorPass &&
      docPass &&
      citationValidity(result) &&
      !result.citations.some((citation) => citation.jurisdiction !== question.jurisdiction) &&
      mustIncludeCoverage === 1;
    return {
      id: question.id,
      category: question.category,
      expectedBehavior: question.expected.behavior,
      actualBehavior: actual,
      expectedDocIds,
      retrievedDocIds: result.retrievedDocIds,
      citationDocIds,
      citationValidity: citationValidity(result),
      jurisdictionLeakage: result.citations.some(
        (citation) => citation.jurisdiction !== question.jurisdiction
      ),
      disclaimerPresent: result.text.includes('This is information, not legal advice.'),
      mustIncludeCoverage,
      topSimilarity: result.topSimilarity,
      latencyMs: Date.now() - startedAt,
      todoDocIds,
      pass,
    };
  } catch (error: unknown) {
    return {
      id: question.id,
      category: question.category,
      expectedBehavior: question.expected.behavior,
      actualBehavior: 'abstain',
      expectedDocIds: question.expected.docIds.filter((id) => id !== 'TODO'),
      retrievedDocIds: [],
      citationDocIds: [],
      citationValidity: false,
      jurisdictionLeakage: false,
      disclaimerPresent: false,
      mustIncludeCoverage: 0,
      topSimilarity: 0,
      latencyMs: Date.now() - startedAt,
      todoDocIds: question.expected.docIds.includes('TODO'),
      pass: false,
      error: error instanceof Error ? error.message : 'unknown_error',
    };
  }
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function rate(values: boolean[]): number {
  return values.length === 0 ? 1 : values.filter(Boolean).length / values.length;
}

async function writeReport(questions: EvalQuestion[], runs: QuestionRun[]): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const report = {
    timestamp,
    questionCount: questions.length,
    metrics: {
      retrievalHitAt5: rate(
        runs
          .filter((run) => run.expectedDocIds.length > 0)
          .map((run) =>
            run.expectedDocIds.some((id) => run.retrievedDocIds.slice(0, 5).includes(id))
          )
      ),
      citationPrecision:
        runs.reduce(
          (sum, run) =>
            sum +
            (run.expectedDocIds.length === 0
              ? 1
              : run.citationDocIds.filter((id) => run.expectedDocIds.includes(id)).length /
                Math.max(run.citationDocIds.length, 1)),
          0
        ) / Math.max(runs.length, 1),
      citationValidity: rate(runs.map((run) => run.citationValidity)),
      abstentionAccuracy: rate(
        runs
          .filter((run) => run.expectedBehavior !== 'answer')
          .map((run) => run.actualBehavior === 'abstain')
      ),
      jurisdictionLeakageCount: runs.filter((run) => run.jurisdictionLeakage).length,
      disclaimerPresentRate: rate(runs.map((run) => run.disclaimerPresent)),
      mustIncludeCoverage:
        runs.reduce((sum, run) => sum + run.mustIncludeCoverage, 0) / Math.max(runs.length, 1),
      medianLatencyMs: median(runs.map((run) => run.latencyMs)),
    },
    unresolvedDocIds: runs.filter((run) => run.todoDocIds).map((run) => run.id),
    questions: runs,
  };
  await mkdir(resolve(root, 'eval-reports'), { recursive: true });
  await writeFile(
    resolve(root, 'eval-reports', `${timestamp}.json`),
    JSON.stringify(report, null, 2)
  );
  const markdown = [
    `# IP-SAKTI evaluation — ${timestamp}`,
    '',
    `Questions: ${questions.length}`,
    `Retrieval hit@5: ${report.metrics.retrievalHitAt5.toFixed(3)}`,
    `Citation precision: ${report.metrics.citationPrecision.toFixed(3)}`,
    `Citation validity: ${report.metrics.citationValidity.toFixed(3)}`,
    `Abstention accuracy: ${report.metrics.abstentionAccuracy.toFixed(3)}`,
    `Jurisdiction leakage count: ${report.metrics.jurisdictionLeakageCount}`,
    `Disclaimer-present rate: ${report.metrics.disclaimerPresentRate.toFixed(3)}`,
    `Must-include coverage: ${report.metrics.mustIncludeCoverage.toFixed(3)}`,
    `Median latency: ${report.metrics.medianLatencyMs}ms`,
    '',
    '| ID | Expected | Actual | Citation valid | Leak | Pass |',
    '|---|---|---|---:|---:|---:|',
    ...runs.map(
      (run) =>
        `| ${run.id} | ${run.expectedBehavior} | ${run.actualBehavior} | ${run.citationValidity ? 'yes' : 'no'} | ${run.jurisdictionLeakage ? 'yes' : 'no'} | ${run.pass ? 'PASS' : 'FAIL'} |`
    ),
  ].join('\n');
  await writeFile(resolve(root, 'eval-reports', `${timestamp}.md`), `${markdown}\n`);
  console.info(markdown);
  if (report.unresolvedDocIds.length > 0)
    console.error(
      `TODO docIds remain in ${report.unresolvedDocIds.length} questions; fill them against corpus/manifest.json.`
    );
  if (report.metrics.jurisdictionLeakageCount > 0) process.exitCode = 1;
  if (report.metrics.citationValidity < 1) process.exitCode = 1;
  if (report.unresolvedDocIds.length > 0) process.exitCode = 1;
}

async function calibrate(questions: EvalQuestion[], runs: QuestionRun[]): Promise<void> {
  const answerable = runs
    .filter((run, index) => questions[index].expected.behavior === 'answer')
    .map((run) => run.topSimilarity);
  const unanswerable = runs
    .filter((run, index) => questions[index].expected.behavior !== 'answer')
    .map((run) => run.topSimilarity);
  const answerMedian = median(answerable);
  const unanswerMedian = median(unanswerable);
  console.info(
    JSON.stringify(
      {
        answerable,
        unanswerable,
        answerableMedian: answerMedian,
        unanswerableMedian: unanswerMedian,
      },
      null,
      2
    )
  );
  console.info(
    `Suggested RETRIEVAL_MIN_SIMILARITY=${Math.max(0, Math.min(1, unanswerMedian + 0.02)).toFixed(2)}`
  );
  console.info(
    `Suggested RETRIEVAL_HIGH_SIMILARITY=${Math.max(0, Math.min(1, answerMedian)).toFixed(2)}`
  );
}

async function writeTodoPreflightReport(questions: EvalQuestion[]): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const unresolved = questions
    .filter((question) => question.expected.docIds.includes('TODO'))
    .map((question) => question.id);
  const report = {
    timestamp,
    status: 'blocked',
    error: 'Expected docIds contain TODO entries.',
    unresolvedDocIds: unresolved,
  };
  await mkdir(resolve(root, 'eval-reports'), { recursive: true });
  await writeFile(
    resolve(root, 'eval-reports', `${timestamp}.json`),
    JSON.stringify(report, null, 2)
  );
  await writeFile(
    resolve(root, 'eval-reports', `${timestamp}.md`),
    `# IP-SAKTI evaluation — preflight blocked\n\nFill expected.docIds against corpus/manifest.json before running the full harness.\n\nUnresolved questions: ${unresolved.join(', ')}\n`
  );
  console.error(
    `Evaluation blocked: ${unresolved.length} questions still contain TODO docIds. Report written to eval-reports/${timestamp}.json`
  );
  process.exitCode = 1;
}

async function main() {
  const questions = JSON.parse(
    await readFile(resolve(root, 'tests/eval/questions.json'), 'utf8')
  ) as EvalQuestion[];
  if (questions.length !== 30)
    throw new Error(`Expected 30 evaluation questions, found ${questions.length}`);
  if (
    !process.argv.includes('--calibrate') &&
    questions.some((question) => question.expected.docIds.includes('TODO'))
  ) {
    await writeTodoPreflightReport(questions);
    return;
  }
  const runs: QuestionRun[] = [];
  for (const question of questions) {
    console.info(`Evaluating ${question.id}...`);
    runs.push(await runQuestion(question));
  }
  if (process.argv.includes('--calibrate')) await calibrate(questions, runs);
  else await writeReport(questions, runs);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Evaluation failed');
  process.exitCode = 1;
});
