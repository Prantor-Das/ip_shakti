'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { useI18n } from '@/components/i18n-provider';
import { getSamhitaContextTopic } from '@/lib/samhita-context';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  jurisdiction: Jurisdiction;
  synthetic?: boolean;
  citations: Citation[];
  confidence?: Confidence;
  abstained?: boolean;
  question?: string;
  englishText?: string;
  translated?: boolean;
  translationFailed?: boolean;
}
type Threads = Record<Jurisdiction, Message[]>;

const starters = [
  {
    icon: FileTextIcon,
    title: 'chat.patent',
    detail: 'chat.patentDetail',
    query: 'How do I assess patentability for my Ayurvedic formulation?',
  },
  {
    icon: ShieldCheckIcon,
    title: 'chat.brand',
    detail: 'chat.brandDetail',
    query: 'What do I need for trademark registration?',
  },
  {
    icon: ScaleIcon,
    title: 'chat.compliance',
    detail: 'chat.complianceDetail',
    query: 'What are the export regulations for Ayurvedic products?',
  },
];

function syntheticGreeting(jurisdiction: Jurisdiction): Message[] {
  return [
    {
      id: `${jurisdiction}-greeting`,
      role: 'assistant',
      jurisdiction,
      synthetic: true,
      citations: [],
      content:
        'Namaste. I’m Sahayak, your guide for Ayurveda intellectual property and regulatory questions.',
    },
  ];
}

function renderText(text: string, citations: Citation[], messageId: string) {
  const parts = text.split(/(\[S[1-6]\])/g);
  return parts.map((part, index) =>
    part.match(/^\[S[1-6]\]$/) ? (
      <sup key={`${part}-${index}`}>
        <a
          href={`#citation-${messageId}-${part.slice(1, -1)}`}
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

function CitationList({ citations, messageId }: { citations: Citation[]; messageId: string }) {
  const { t } = useI18n();
  if (!citations.length) return null;
  return (
    <div className="mt-4 border-t border-emerald-900/10 pt-3">
      <p className="mb-2 text-xs font-semibold text-emerald-950/60">{t('chat.sources')}</p>
      <div className="space-y-2">
        {citations.map((citation) => (
          <div
            id={`citation-${messageId}-${citation.id}`}
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
              <span className="mt-0.5 block">
                {citation.sectionRef ?? t('chat.sectionNotSpecified')} · {citation.version} ·{' '}
                {t('chat.asOf')} {citation.asOfDate}
              </span>
              {citation.sourceUrl && (
                <a
                  href={citation.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block text-primary underline"
                >
                  {t('chat.officialSource')}
                </a>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Escalation({
  message,
  formulationType,
}: {
  message: Message;
  formulationType?: FormulationType;
}) {
  const { contactEmail, t } = useI18n();
  if (!message.abstained && message.confidence !== 'low') return null;
  const email = contactEmail;
  if (!email) return null;
  const subject = encodeURIComponent(`IP-SAKTI facilitator request — ${message.jurisdiction}`);
  const body = encodeURIComponent(
    `Question: ${message.question ?? 'See chat summary'}\nJurisdiction: ${message.jurisdiction}\nFormulation type: ${formulationType ?? 'unsure'}\n\nSummary:\n${message.content}`
  );
  return (
    <div className="mt-4 rounded-xl border border-amber-900/15 bg-amber-50 p-3 text-xs text-amber-950">
      <p className="font-semibold">{t('chat.humanReview')}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={`mailto:${email}?subject=${subject}&body=${body}`}
          className="rounded-lg bg-amber-800 px-3 py-2 font-semibold text-white"
        >
          {t('chat.talkToFacilitator')}
        </a>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(message.content)}
          className="rounded-lg border border-amber-900/20 px-3 py-2 font-semibold"
        >
          {t('chat.copySummary')}
        </button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  formulationType,
}: {
  message: Message;
  formulationType?: FormulationType;
}) {
  const { t } = useI18n();
  const [showEnglish, setShowEnglish] = React.useState(false);
  const assistant = message.role === 'assistant';
  const content = (
    showEnglish && message.englishText ? message.englishText : message.content
  ).replace(/\n\nThis is information, not legal advice\.$/, '');
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
            {content.split('\n').map((line, index) => (
              <p key={`${message.id}-${index}`} className={index ? 'mt-2' : undefined}>
                {renderText(line || '\u00a0', message.citations, message.id)}
              </p>
            ))}
          </div>
          {assistant && !message.synthetic && message.confidence && (
            <div className="mt-4 flex items-center gap-2 border-t border-emerald-900/10 pt-3 text-xs text-emerald-950/55">
              <CheckIcon className="size-3.5 text-primary" />
              {t('chat.confidence')}: {message.confidence}
            </div>
          )}
          {assistant && !message.synthetic && message.translated && message.englishText && (
            <button
              type="button"
              onClick={() => setShowEnglish((current) => !current)}
              className="mt-3 text-xs font-semibold text-primary underline"
            >
              {showEnglish
                ? t('chat.machineTranslated')
                : `${t('chat.machineTranslated')} — ${t('chat.showEnglish')}`}
            </button>
          )}
          {assistant && !message.synthetic && message.translationFailed && (
            <p className="mt-3 text-xs font-semibold text-amber-800">{t('chat.shownInEnglish')}</p>
          )}
          {assistant && !message.synthetic && (
            <p className="mt-3 border-t border-emerald-900/10 pt-3 text-xs text-emerald-950/55">
              {t('chat.disclaimer')}
            </p>
          )}
          {assistant && !message.synthetic && (
            <CitationList citations={message.citations} messageId={message.id} />
          )}
          {assistant && !message.synthetic && (
            <Escalation message={message} formulationType={formulationType} />
          )}
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
  const { language, t } = useI18n();
  const searchParams = useSearchParams();
  const contextTopic = getSamhitaContextTopic(searchParams.get('topic') ?? undefined);
  const [jurisdiction, setJurisdiction] = React.useState<Jurisdiction>('india');
  const [formulationType, setFormulationType] = React.useState<FormulationType | undefined>();
  const [threads, setThreads] = React.useState<Threads>(() => ({
    india: syntheticGreeting('india'),
    international: syntheticGreeting('international'),
  }));
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [translationStatus, setTranslationStatus] = React.useState(false);
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
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          jurisdiction,
          citations: [],
          question: trimmed,
        },
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
        body: JSON.stringify({
          message: trimmed,
          lang: language,
          jurisdiction,
          formulationType,
          contextTopic: contextTopic?.slug,
          history,
        }),
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
          if (event.type === 'status') setTranslationStatus(true);
          if (event.type === 'done')
            updateAssistant(assistantId, {
              confidence: event.confidence,
              citations: event.citations,
              abstained: event.abstained,
              englishText: event.englishText,
              translated: event.translated,
              translationFailed: event.translationFailed,
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
      setTranslationStatus(false);
    }
  }

  function stopResponse() {
    abortRef.current?.abort();
    setThreads((current) => ({
      ...current,
      [jurisdiction]: current[jurisdiction].map((message) =>
        message.role === 'assistant' && !message.content && !message.synthetic
          ? { ...message, content: 'Response stopped.', confidence: 'low', abstained: true }
          : message
      ),
    }));
  }

  return (
    <div
      className={cn(
        'min-h-dvh px-4 pb-8 pt-24 text-emerald-950 transition-colors sm:px-6 lg:px-8',
        jurisdiction === 'india' ? 'bg-[#f7faf7]' : 'bg-[#f7f9fc]'
      )}
    >
      <div className="mx-auto max-w-3xl">
        {bannerVisible && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50 px-4 py-3 text-xs text-amber-950">
            <span>{t('chat.disclaimer')}</span>
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
                {t('nav.assistant')}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
                {t('chat.title')}
              </h1>
            </div>
            <JurisdictionToggle value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-950/60">
            {t('chat.description')}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <Link href="/abs-tkdl" className="text-primary underline">
              ABS &amp; TKDL helper
            </Link>
            <Link href="/sources" className="text-primary underline">
              Corpus sources
            </Link>
          </div>
          <div className="mt-4">
            <ClassifyPanel value={formulationType} onChange={setFormulationType} />
            {formulationType && (
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  void submit(
                    `Explain what a ${formulationType} formulation means for IP, access and benefit-sharing, and regulation using the current sources.`
                  )
                }
                className="mt-3 rounded-lg border border-primary/30 bg-emerald-50 px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50"
              >
                {t('chat.explain')}
              </button>
            )}
          </div>
        </header>
        {contextTopic && (
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-primary">
            Discussing: {contextTopic.commonName}
          </div>
        )}
        <div aria-live="polite" className="space-y-5">
          {activeMessages.map((message) => (
            <MessageBubble key={message.id} message={message} formulationType={formulationType} />
          ))}
          {loading && (
            <div role="status" className="flex items-center gap-3 text-sm text-emerald-950/55">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                <LeafIcon className="size-4" />
              </span>
              {translationStatus ? t('chat.translating') : t('chat.reading')}
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
                  <span className="block text-sm font-semibold text-emerald-950">{t(title)}</span>
                  <span className="mt-1 block text-xs text-emerald-950/55">{t(detail)}</span>
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
            placeholder={t('chat.placeholder')}
            aria-label={t('chat.placeholder')}
            className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-emerald-950 outline-none placeholder:text-emerald-950/35"
          />
          <div className="flex items-center justify-between border-t border-emerald-900/10 px-2 pt-2">
            <span className="text-xs text-emerald-950/40">{t('chat.inputHint')}</span>
            <button
              type="button"
              aria-label={loading ? t('chat.stop') : t('chat.send')}
              onClick={() => (loading ? stopResponse() : void submit(input))}
              disabled={!loading && !input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-400"
            >
              {loading ? <SquareIcon className="size-3.5" /> : <ArrowUpIcon className="size-4" />}
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-emerald-950/45">{t('chat.privacy')}</p>
      </div>
    </div>
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
