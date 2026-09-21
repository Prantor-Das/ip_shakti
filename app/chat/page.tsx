'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowUpIcon,
  BookOpenIcon,
  CheckIcon,
  FileTextIcon,
  LeafIcon,
  Loader2Icon,
  MicIcon,
  PlusIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MessageRole = 'user' | 'assistant';
type SendStatus = 'idle' | 'loading' | 'success';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  citations?: string[];
  confidence?: 'high' | 'medium' | 'low';
  timestamp: Date;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Namaste. I’m Sahayak, your guide for Ayurveda intellectual property and regulatory questions.',
    confidence: 'high',
    citations: [],
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Start with a question about a formulation, a filing route, traditional knowledge, or a target market. I’ll keep the answer practical and show where it comes from.',
    confidence: 'high',
    citations: [],
    timestamp: new Date(),
  },
];

const starterQuestions = [
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
  {
    icon: BookOpenIcon,
    title: 'Document knowledge',
    detail: 'Traditional knowledge and TKDL',
    query: 'How should I document traditional knowledge for my product?',
  },
];

function CitationList({ citations }: { citations: string[] }) {
  if (!citations.length) return null;
  return (
    <div className="mt-4 border-t border-emerald-900/10 pt-3">
      <p className="mb-2 text-xs font-semibold text-emerald-950/60">Sources used</p>
      <div className="space-y-1.5">
        {citations.map((citation) => (
          <div key={citation} className="flex items-start gap-2 text-xs text-emerald-950/65">
            <BookOpenIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>{citation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const assistant = message.role === 'assistant';
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
          {message.content.split('\n').map((line, index) => (
            <p key={`${message.id}-${index}`} className={index ? 'mt-2' : undefined}>
              {line || '\u00a0'}
            </p>
          ))}
          {assistant && message.confidence && (
            <div className="mt-4 flex items-center gap-2 border-t border-emerald-900/10 pt-3 text-xs text-emerald-950/55">
              <CheckIcon className="size-3.5 text-primary" />
              {message.confidence === 'high'
                ? 'High-confidence guidance'
                : 'Review with a qualified professional'}
            </div>
          )}
          {assistant && <CitationList citations={message.citations ?? []} />}
        </div>
      </div>
      {!assistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-xs font-semibold text-primary">
          You
        </div>
      )}
    </motion.article>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  status,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  status: SendStatus;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const busy = status === 'loading';
  const canSend = value.trim().length > 0 && !busy;
  return (
    <div id="chat-input" className="rounded-2xl border border-emerald-900/15 bg-white p-2 shadow-lg shadow-emerald-950/5 scroll-mt-24">
      <textarea
        ref={inputRef}
        value={value}
        disabled={busy}
        rows={2}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && canSend) {
            event.preventDefault();
            onSubmit(value);
          }
        }}
        placeholder="Ask about patents, trademarks, GI protection, or compliance..."
        aria-label="Ask Sahayak a question"
        className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-emerald-950 outline-none placeholder:text-emerald-950/35"
      />
      <div className="flex items-center justify-between border-t border-emerald-900/10 px-2 pt-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex size-8 items-center justify-center rounded-lg text-emerald-950/45 transition hover:bg-emerald-50 hover:text-primary"
          >
            <PlusIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Use microphone"
            className="flex size-8 items-center justify-center rounded-lg text-emerald-950/45 transition hover:bg-emerald-50 hover:text-primary"
          >
            <MicIcon className="size-4" />
          </button>
          <span className="hidden pl-2 text-xs text-emerald-950/40 sm:inline">
            Enter to send · Shift + Enter for a new line
          </span>
        </div>
        <button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={() => onSubmit(value)}
          className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-400"
        >
          {busy ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : status === 'success' ? (
            <CheckIcon className="size-4" />
          ) : (
            <ArrowUpIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const contextParam = searchParams ? searchParams.get('context') : null;

  const initialMessages: Message[] = React.useMemo(() => {
    if (contextParam) {
      return [
        {
          id: '1',
          role: 'assistant',
          content: `Namaste. I am Sahayak. I see you are exploring ${contextParam} from the Samhita Knowledge Repository.`,
          confidence: 'high',
          citations: ['Samhita Knowledge Repository', 'TKDL Digital Database'],
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: `How can I help evaluate prior art, Section 3(p) compliance, or bioactive extract patentability for ${contextParam}?`,
          confidence: 'high',
          citations: [],
          timestamp: new Date(),
        },
      ];
    }
    return DEMO_MESSAGES;
  }, [contextParam]);

  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = React.useState('');
  const [status, setStatus] = React.useState<SendStatus>('idle');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const previousMessageCount = React.useRef(initialMessages.length);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    // Focus keyboard input area on load
    inputRef.current?.focus();
    if (window.location.hash === '#chat-input') {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  React.useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);

  const handleSubmit = React.useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: value,
        timestamp: new Date(),
      };
      const assistantId = `assistant-${Date.now()}`;
      const currentHistory = [...messages];
      setMessages((previous) => [
        ...previous,
        userMessage,
        { id: assistantId, role: 'assistant', content: '', citations: [], timestamp: new Date() },
      ]);
      setInputValue('');
      setStatus('loading');
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: value,
            history: currentHistory.map(({ role, content }) => ({ role, content })),
          }),
        });
        if (!response.ok || !response.body)
          throw new Error('Unable to reach Sahayak right now. Please try again.');
        const citationsHeader = response.headers.get('X-Citations');
        const confidence =
          (response.headers.get('X-Confidence') as Message['confidence']) || 'medium';
        const citations = citationsHeader ? (JSON.parse(citationsHeader) as string[]) : [];
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = '';
        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          content += decoder.decode(chunk, { stream: true });
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId ? { ...message, content, citations, confidence } : message
            )
          );
        }
        setStatus('success');
        window.setTimeout(() => setStatus('idle'), 700);
      } catch (error) {
        const content =
          error instanceof Error
            ? error.message
            : 'Unable to reach Sahayak right now. Please try again.';
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId ? { ...message, content, confidence: 'low' } : message
          )
        );
        setStatus('idle');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  return (
    <main className="min-h-dvh bg-[#f7faf7] px-4 pb-8 pt-24 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="min-w-0">
          <header className="mb-8 border-b border-emerald-900/10 pb-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary" />
              IP-SAKTI assistant
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-emerald-950 text-balance sm:text-4xl">
              A clear next step for your Ayurveda IP question.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-950/60 text-pretty">
              Research-backed guidance for protecting formulations, documenting heritage, and
              entering new markets.
            </p>
          </header>
          <div className="space-y-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-emerald-950/55">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                  <LeafIcon className="size-4" />
                </span>
                Sahayak is reading your question...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {!messages.some((message) => message.role === 'user') && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {starterQuestions.map(({ icon: Icon, title, detail, query }) => (
                <button
                  key={title}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSubmit(query)}
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
          <div className="mt-8">
            <Composer
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              status={status}
              inputRef={inputRef}
            />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-emerald-950/45">
              <ShieldCheckIcon className="size-3.5" />
              Educational guidance only. Consult a qualified IP or regulatory professional.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7faf7] pt-24 text-center">Loading Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}

