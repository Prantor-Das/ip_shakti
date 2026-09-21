'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, CheckIcon, ExternalLinkIcon, LeafIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OFFICIAL_LINKS } from '@/lib/official-links';
import type { Citation } from '@/lib/chat/types';

type FactKey = 'person' | 'access' | 'purpose' | 'stage';
type Facts = Record<FactKey, string>;
type HelperResult = {
  text: string;
  citations: Citation[];
  nextSteps: string[];
  abstained: boolean;
  confidence: 'high' | 'medium' | 'low';
};

const fields: Array<{ key: FactKey; label: string; options: Array<[string, string]> }> = [
  {
    key: 'person',
    label: 'Who I am',
    options: [
      ['indian-citizen-entity', 'Indian citizen or entity'],
      ['foreign-entity', 'Foreign entity'],
      ['ayush-practitioner', 'AYUSH practitioner'],
      ['codified-tk-user', 'Codified-TK user'],
    ],
  },
  {
    key: 'access',
    label: 'What I am accessing',
    options: [
      ['wild-biological-resource', 'Wild-collected biological resource'],
      ['cultivated-medicinal-plant', 'Cultivated medicinal plant'],
      ['associated-traditional-knowledge', 'Associated traditional knowledge'],
      ['imported-material', 'Imported material'],
    ],
  },
  {
    key: 'purpose',
    label: 'Purpose',
    options: [
      ['research', 'Research'],
      ['commercial-utilisation', 'Commercial utilisation'],
      ['applying-for-an-ipr', 'Applying for an IPR'],
      ['transfer-of-results', 'Transfer of results / third-party transfer'],
    ],
  },
  {
    key: 'stage',
    label: 'Stage',
    options: [
      ['considering-access', 'Considering access'],
      ['accessed-research-underway', 'Accessed / research underway'],
      ['commercialisation-or-filing', 'Commercialisation or filing'],
    ],
  },
];

function citedText(text: string) {
  return text.split(/(\[S\d+\])/g).map((part, index) =>
    /^\[S\d+\]$/.test(part) ? (
      <sup key={index} className="ml-0.5 font-bold text-primary">
        {part.slice(1, -1)}
      </sup>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

function CitationCards({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <div className="mt-5 border-t border-emerald-900/10 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-950/55">
        Sources used
      </p>
      <div className="space-y-2">
        {citations.map((citation) => (
          <div key={citation.id} className="flex gap-2 text-xs text-emerald-950/70">
            <BookOpenIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <strong>
                {citation.id} · {citation.title}
              </strong>
              <span className="block">
                {citation.sectionRef ?? 'Section not specified'} · {citation.version} · as of{' '}
                {citation.asOfDate}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AbsTkdlPage() {
  const [facts, setFacts] = React.useState<Facts>({
    person: '',
    access: '',
    purpose: '',
    stage: '',
  });
  const [result, setResult] = React.useState<HelperResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/abs-tkdl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facts),
      });
      const body = (await response.json()) as HelperResult & { error?: string };
      if (!response.ok) throw new Error(body.error ?? 'Unable to run the helper.');
      setResult(body);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Unable to run the helper.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#f7faf7] px-4 pb-16 pt-28 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              IP-SAKTI Sahayak
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">ABS compliance helper</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950/65">
              Share facts, not conclusions. The helper turns them into an India-mode corpus question
              and shows only cited material.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-white px-3 py-2 text-xs font-semibold text-primary"
          >
            Ask the assistant <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="text-sm font-semibold">
                {field.label}
                <select
                  required
                  value={facts[field.key]}
                  onChange={(event) =>
                    setFacts((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-emerald-900/15 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-primary"
                >
                  <option value="">Choose one</option>
                  {field.options.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-emerald-950/55">
            This guided form records factual context only. It does not determine whether a filing,
            approval, consent, or benefit-sharing arrangement is legally required.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Searching the India corpus…' : 'Run India corpus check'}{' '}
            <ArrowRightIcon className="size-4" />
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-900/15 bg-red-50 p-4 text-sm text-red-900">
            {error}
          </div>
        )}
        {result && (
          <section className="mt-6 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <LeafIcon className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  India corpus result
                </p>
                <div className="mt-3 text-sm leading-6">
                  {result.text.split('\n').map((line, index) => (
                    <p key={index} className={index ? 'mt-2' : undefined}>
                      {citedText(line)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {result.nextSteps.length > 0 && (
              <div className="mt-6 rounded-xl border border-primary/15 bg-emerald-50 p-4">
                <p className="text-sm font-semibold">Next steps found in cited chunks</p>
                <ul className="mt-3 space-y-2 text-sm leading-6">
                  {result.nextSteps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-primary" />{' '}
                      <span>{citedText(step)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.abstained && (
              <div className="mt-5 rounded-xl border border-amber-900/15 bg-amber-50 p-4 text-sm text-amber-950">
                <p>
                  The India corpus does not cover this fact pattern. Please use the assistant to
                  prepare a question for an IP facilitator or qualified professional.
                </p>
                <Link
                  href="/chat"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-800 px-3 py-2 text-xs font-semibold text-white"
                >
                  Continue to escalation chat <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            )}
            <CitationCards citations={result.citations} />
            <p className="mt-5 border-t border-emerald-900/10 pt-4 text-xs text-emerald-950/55">
              Information, not legal advice.
            </p>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Prior-art pointer
          </p>
          <h2 className="mt-2 text-2xl font-semibold">TKDL and official research tools</h2>
          {/* TODO(legal-review): verify explanatory wording against the ingested TKDL corpus before production. */}
          <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-950/65">
            TKDL is a structured documentation resource for traditional knowledge used in the
            patent-examination ecosystem. Use the official resource below to understand its scope
            and access conditions; this page does not claim that the full TKDL database is publicly
            queryable.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OFFICIAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'rounded-xl border border-emerald-900/10 p-3 transition hover:border-primary/40'
                )}
              >
                <span className="flex items-center justify-between text-sm font-semibold">
                  {link.name}
                  <ExternalLinkIcon className="size-3.5 text-primary" />
                </span>
                <span className="mt-1 block text-xs leading-5 text-emerald-950/55">
                  {link.description}
                </span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-emerald-950/55">Information, not legal advice.</p>
        </section>
      </div>
    </main>
  );
}
