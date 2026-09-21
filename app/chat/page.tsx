'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowUpIcon,
  BookOpenIcon,
  CheckIcon,
  FileTextIcon,
  LeafIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SquareIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassifyPanel } from '@/components/chat/classify-panel';
import { JurisdictionToggle } from '@/components/chat/jurisdiction-toggle';
import type {
  ChatEvent,
  Citation,
  Confidence,
  FormulationType,
  Jurisdiction,
  MessageRole,
} from '@/lib/chat/types';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  jurisdiction: Jurisdiction;
  synthetic?: boolean;
  citations: Citation[];
  confidence?: Confidence;
  abstained?: boolean;
}
type Threads = Record<Jurisdiction, Message[]>;

const starters = [
  {
    icon: FileTextIcon,
    title: 'Patent a formulation',
    detail: 'Check novelty and filing options',
    query: 'How do I assess patentability for my Ayurvedic formulation?',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Protect a brand',
    detail: 'Trademark basics for Ayurveda products',
    query: 'What do I need for trademark registration?',
  },
  {
    icon: ScaleIcon,
    title: 'Check compliance',
    detail: 'AYUSH and export requirements',
    query: 'What are the export regulations for Ayurvedic products?',
  },
];

function syntheticGreeting(jurisdiction: Jurisdiction, context: string | null): Message[] {
  return [
    {
      id: `${jurisdiction}-greeting`,
      role: 'assistant',
      jurisdiction,
      synthetic: true,
      citations: [],
      content: context
        ? `Namaste. I’m Sahayak. I see you are exploring ${context} from the Samhita Knowledge Repository.`
        : 'Namaste. I’m Sahayak, your guide for Ayurveda intellectual property and regulatory questions.',
    },
  ];
}

function renderText(text: string, citations: Citation[]) {
  const parts = text.split(/(\[S[1-6]\])/g);
  return parts.map((part, index) =>
    part.match(/^\[S[1-6]\]$/) ? (
      <sup key={`${part}-${index}`}>
        <a
          href={`#citation-${part.slice(1, -1)}`}
          className="ml-0.5 font-bold text-primary underline"
          title={citations.find((citation) => citation.id === part.slice(1, -1))?.title ?? 'Source'}
        >
          {part.slice(1, -1)}
        </a>
      </sup>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

function CitationList({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <div className="mt-4 border-t border-emerald-900/10 pt-3">
      <p className="mb-2 text-xs font-semibold text-emerald-950/60">Sources used</p>
      <div className="space-y-2">
        {citations.map((citation) => (
          <div
            id={`citation-${citation.id}`}
            key={citation.id}
            className="flex items-start gap-2 text-xs text-emerald-950/65"
          >
            <BookOpenIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">
                {citation.id} · {citation.title}
              </span>
              <span className="ml-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] text-primary">
                {citation.jurisdiction}
              </span>
              <span className="block mt-0.5">{citation.ref}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const assistant = message.role === 'assistant';
  return (
    <article
      className={cn('flex gap-3 sm:gap-4', assistant ? 'items-start' : 'items-end justify-end')}
    >
      {assistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <LeafIcon className="size-4" />
        </div>
      )}
      <div className={cn('max-w-2xl', assistant ? 'w-full' : 'max-w-[85%]')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3.5 text-sm leading-6 sm:px-5',
            assistant
              ? 'border border-emerald-900/10 bg-white text-emerald-950 shadow-sm'
              : 'bg-primary text-white shadow-sm'
          )}
        >
          {assistant && (
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {message.jurisdiction}
            </div>
          )}
          <div>
            {message.content.split('\n').map((line, index) => (
              <p key={`${message.id}-${index}`} className={index ? 'mt-2' : undefined}>
                {renderText(line || '\u00a0', message.citations)}
              </p>
            ))}
          </div>
          {assistant && !message.synthetic && message.confidence && (
            <div className="mt-4 flex items-center gap-2 border-t border-emerald-900/10 pt-3 text-xs text-emerald-950/55">
              <CheckIcon className="size-3.5 text-primary" />
              Confidence: {message.confidence}
            </div>
          )}
          {assistant && !message.synthetic && <CitationList citations={message.citations} />}
        </div>
      </div>
      {!assistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-xs font-semibold text-primary">
          You
        </div>
      )}
    </article>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get('context');
  const [jurisdiction, setJurisdiction] = React.useState<Jurisdiction>('india');
  const [formulationType, setFormulationType] = React.useState<FormulationType | undefined>();
  const [threads, setThreads] = React.useState<Threads>(() => ({
    india: syntheticGreeting('india', context),
    international: syntheticGreeting('international', context),
  }));
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [bannerVisible, setBannerVisible] = React.useState(true);
  const abortRef = React.useRef<AbortController | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);
  const activeMessages = threads[jurisdiction];

  React.useEffect(() => () => abortRef.current?.abort(), []);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const updateAssistant = React.useCallback(
    (id: string, update: Partial<Message>) =>
      setThreads((current) => ({
        ...current,
        [jurisdiction]: current[jurisdiction].map((message) =>
          message.id === id ? { ...message, ...update } : message
        ),
      })),
    [jurisdiction]
  );

  async function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    const history = activeMessages
      .filter((message) => !message.synthetic && message.content)
      .map(({ role, content }) => ({ role, content }));
    const user: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      jurisdiction,
      citations: [],
    };
    const assistantId = `assistant-${Date.now()}`;
    setThreads((current) => ({
      ...current,
      [jurisdiction]: [
        ...current[jurisdiction],
        user,
        { id: assistantId, role: 'assistant', content: '', jurisdiction, citations: [] },
      ],
    }));
    setInput('');
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ message: trimmed, jurisdiction, formulationType, history }),
      });
      if (!response.ok || !response.body) throw new Error('Unable to reach Sahayak right now.');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatEvent;
          if (event.type === 'delta')
            setThreads((current) => ({
              ...current,
              [jurisdiction]: current[jurisdiction].map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + event.text }
                  : message
              ),
            }));
          if (event.type === 'done')
            updateAssistant(assistantId, {
              confidence: event.confidence,
              citations: event.citations,
              abstained: event.abstained,
            });
          if (event.type === 'error')
            updateAssistant(assistantId, {
              content: 'Unable to answer right now. Please try again.',
              confidence: 'low',
              abstained: true,
            });
        }
        if (done) break;
      }
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        updateAssistant(assistantId, {
          content: 'Unable to answer right now. Please try again.',
          confidence: 'low',
          abstained: true,
        });
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  }

  return (
    <main
      className={cn(
        'min-h-dvh px-4 pb-8 pt-24 text-emerald-950 transition-colors sm:px-6 lg:px-8',
        jurisdiction === 'india' ? 'bg-[#f7faf7]' : 'bg-[#f7f9fc]'
      )}
    >
      <div className="mx-auto max-w-3xl">
        {bannerVisible && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50 px-4 py-3 text-xs text-amber-950">
            <span>This tool provides information, not legal advice.</span>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              aria-label="Dismiss banner"
            >
              ×
            </button>
          </div>
        )}
        <header className="mb-6 border-b border-emerald-900/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="size-2 rounded-full bg-primary" />
                IP-SAKTI assistant
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
                A clear next step for your Ayurveda IP question.
              </h1>
            </div>
            <JurisdictionToggle value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-950/60">
            Research-backed guidance for protecting formulations, documenting heritage, and entering
            new markets.
          </p>
          <div className="mt-4">
            <ClassifyPanel value={formulationType} onChange={setFormulationType} />
          </div>
        </header>
        <div className="space-y-5">
          {activeMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-sm text-emerald-950/55">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                <LeafIcon className="size-4" />
              </span>
              Sahayak is reading your question...
            </div>
          )}
          <div ref={endRef} />
        </div>
        {!activeMessages.some((message) => message.role === 'user') && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {starters.map(({ icon: Icon, title, detail, query }) => (
              <button
                key={title}
                type="button"
                disabled={loading}
                onClick={() => void submit(query)}
                className="group flex items-start gap-3 rounded-xl border border-emerald-900/10 bg-white p-3.5 text-left transition hover:border-primary/40 disabled:opacity-50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-emerald-950">{title}</span>
                  <span className="mt-1 block text-xs text-emerald-950/55">{detail}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <div
          id="chat-input"
          className="mt-8 rounded-2xl border border-emerald-900/15 bg-white p-2 shadow-lg shadow-emerald-950/5"
        >
          <textarea
            value={input}
            disabled={loading}
            rows={2}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void submit(input);
              }
            }}
            placeholder="Ask about patents, trademarks, GI protection, or compliance..."
            aria-label="Ask Sahayak a question"
            className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-emerald-950 outline-none placeholder:text-emerald-950/35"
          />
          <div className="flex items-center justify-between border-t border-emerald-900/10 px-2 pt-2">
            <span className="text-xs text-emerald-950/40">
              Enter to send · Shift + Enter for a new line
            </span>
            <button
              type="button"
              aria-label={loading ? 'Stop response' : 'Send message'}
              onClick={() => (loading ? abortRef.current?.abort() : void submit(input))}
              disabled={!loading && !input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-400"
            >
              {loading ? <SquareIcon className="size-3.5" /> : <ArrowUpIcon className="size-4" />}
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-emerald-950/45">
          Don&apos;t enter unpublished or confidential invention details.
        </p>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#f7faf7] pt-24 text-center">Loading Chat...</div>}
    >
      <ChatContent />
    </Suspense>
  );
}
