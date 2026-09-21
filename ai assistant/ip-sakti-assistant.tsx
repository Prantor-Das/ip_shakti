'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SendIcon,
  Loader2Icon,
  CheckIcon,
  ArrowUpIcon,
  PlusIcon,
  UploadIcon,
  GlobeIcon,
  TelescopeIcon,
  MicIcon,
  SquareIcon,
  AudioLinesIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type MessageRole = 'user' | 'assistant';
type SendStatus = 'idle' | 'loading' | 'success';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  citations?: string[];
  timestamp: Date;
}

// Constants
const EASE = [0.2, 0, 0, 1] as const;
const SPRING_SOFT = { type: 'spring' as const, stiffness: 420, damping: 32 };
const SPRING_PRESS = { type: 'spring' as const, stiffness: 500, damping: 28 };

const MENU_PANEL_CLASS = cn(
  'bg-slate-950/95 backdrop-blur-xl text-white origin-bottom-left overflow-hidden rounded-2xl border border-slate-800 p-1.5',
  'shadow-2xl'
);

const TOOLBAR_BTN_CLASS = cn(
  'relative flex size-9 cursor-pointer items-center justify-center rounded-xl',
  'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
  'hover:bg-slate-800 hover:text-white',
  'focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:outline-none',
  'disabled:pointer-events-none disabled:opacity-40'
);

// Demo messages for initial state
const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Namaste! I'm IP-SAKTI Sahayak, your Ayurveda IP & Regulatory Assistant. I can help you with:",
    citations: [],
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '• Patent filing for Ayurvedic formulations\n• Trademark registration guidance\n• Geographical Indications (GI) protection\n• Regulatory compliance (AYUSH, FDA, EU standards)\n• Traditional knowledge documentation\n• International market requirements',
    citations: [],
    timestamp: new Date(Date.now() - 45000),
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Ask me anything about protecting your Ayurvedic intellectual property or navigating regulatory requirements across different markets.',
    citations: [],
    timestamp: new Date(Date.now() - 30000),
  },
];

// ============================================================================
// AI Prompt Input Component (Simplified)
// ============================================================================

interface AiPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  status?: SendStatus;
  placeholder?: string;
}

const AiPromptInput = React.forwardRef<HTMLTextAreaElement, AiPromptInputProps>(
  ({ value, onChange, onSubmit, disabled, status = 'idle', placeholder }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [height, setHeight] = React.useState<number | 'auto'>('auto');
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const mirrorRef = React.useRef<HTMLDivElement | null>(null);

    const isLoading = status === 'loading';
    const isSuccess = status === 'success';
    const hasText = value.trim().length > 0;
    const showSend = hasText || isLoading || isSuccess;

    // Auto-resize textarea
    const resize = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;

      const styles = window.getComputedStyle(el);
      const lineHeight = Number.parseFloat(styles.lineHeight) || 24;
      const paddingY =
        Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
      const minH = lineHeight * 1 + paddingY;
      const maxH = lineHeight * 6 + paddingY;

      el.style.height = 'auto';
      const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
      setHeight(next);
      el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
    }, [value]);

    React.useLayoutEffect(() => {
      resize();
    }, [resize, value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !disabled && !isLoading) {
        e.preventDefault();
        onSubmit(value);
      }
    };

    return (
      <motion.div
        data-slot="ai-prompt-input"
        data-focused={focused || undefined}
        data-disabled={disabled || undefined}
        data-status={status}
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(16, 185, 129, 0.3), 0 20px 40px -12px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800',
          'transition-all duration-200',
          disabled && 'pointer-events-none opacity-55'
        )}
      >
        <div
          ref={mirrorRef}
          aria-hidden
          className="invisible absolute top-0 left-0 -z-10 px-4 py-3 text-base leading-6 break-words whitespace-pre-wrap font-sans"
        />

        <div className="relative min-h-12">
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            value={value}
            disabled={disabled || isLoading}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder || 'Ask about patents, compliance, GI protection...'}
            className={cn(
              'relative z-10 block w-full resize-none bg-transparent px-4 py-3',
              'text-base text-white placeholder-slate-500',
              'outline-none focus:outline-none',
              'disabled:cursor-not-allowed',
              'font-sans transition-colors'
            )}
            style={{ height: typeof height === 'number' ? height : undefined }}
            rows={1}
          />
        </div>

        <AnimatePresence initial={false}>
          {focused || hasText ? (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={TOOLBAR_BTN_CLASS}
                  disabled={disabled || isLoading}
                >
                  <PlusIcon className="size-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={TOOLBAR_BTN_CLASS}
                  disabled={disabled || isLoading}
                >
                  <GlobeIcon className="size-4" />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={TOOLBAR_BTN_CLASS}
                  disabled={disabled || isLoading}
                >
                  <MicIcon className="size-4" />
                </motion.button>

                <motion.button
                  whileHover={showSend ? { scale: 1.08 } : undefined}
                  whileTap={showSend ? { scale: 0.94 } : undefined}
                  onClick={() => {
                    if (showSend && !isLoading) onSubmit(value);
                  }}
                  disabled={!showSend || isLoading}
                  className={cn(
                    'relative flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full',
                    'transition-all duration-200',
                    'focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:outline-none',
                    'disabled:pointer-events-none',
                    showSend
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-default'
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.span
                        key="loader"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Loader2Icon className="size-5 animate-spin" />
                      </motion.span>
                    ) : isSuccess ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <CheckIcon className="size-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <ArrowUpIcon className="size-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  }
);

AiPromptInput.displayName = 'AiPromptInput';

// ============================================================================
// Citation Card Component
// ============================================================================

interface CitationCardProps {
  source: string;
  excerpt?: string;
}

const CitationCard = ({ source, excerpt }: CitationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-3 rounded-lg bg-slate-800/50 border border-slate-700 p-3 text-xs text-slate-300"
  >
    <div className="font-semibold text-slate-200 mb-1">Source:</div>
    <div className="text-slate-400">{source}</div>
    {excerpt && <div className="mt-2 italic text-slate-500">{excerpt}</div>}
  </motion.div>
);

// ============================================================================
// Message Display Component
// ============================================================================

interface MessageDisplayProps {
  message: Message;
}

const MessageDisplay = ({ message }: MessageDisplayProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isAssistant ? 'justify-start' : 'justify-end')}
    >
      {isAssistant && (
        <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          IP
        </div>
      )}

      <div className={cn('max-w-2xl', isAssistant ? 'flex-1' : 'flex-0')}>
        <motion.div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isAssistant
              ? 'bg-slate-800/60 text-slate-50 border border-slate-700/50'
              : 'bg-emerald-600 text-white'
          )}
        >
          {message.content.split('\n').map((line, idx) => (
            <div key={idx}>{line || '\n'}</div>
          ))}
        </motion.div>

        {isAssistant && message.citations && message.citations.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.citations.map((citation, idx) => (
              <CitationCard key={idx} source={citation} />
            ))}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold flex-shrink-0">
          U
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// Main IP-SAKTI Assistant Page
// ============================================================================

export default function IpSaktiAssistant() {
  const [messages, setMessages] = React.useState<Message[]>(DEMO_MESSAGES);
  const [inputValue, setInputValue] = React.useState('');
  const [status, setStatus] = React.useState<SendStatus>('idle');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const timersRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = React.useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: value,
        timestamp: new Date(),
      };

      const aiMsgId = `msg-${Date.now()}-ai`;
      const assistantMessagePlaceholder: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        citations: [],
        timestamp: new Date(),
      };

      const currentHistory = [...messages];

      setMessages((prev) => [...prev, userMessage, assistantMessagePlaceholder]);
      setInputValue('');
      setStatus('loading');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: value,
            history: currentHistory.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to fetch AI response');
        }

        const citationsHeader = response.headers.get('X-Citations');
        let citations: string[] = [];
        if (citationsHeader) {
          try {
            citations = JSON.parse(citationsHeader);
          } catch {
            citations = [];
          }
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          accumulatedContent += decoder.decode(chunk, { stream: true });

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: accumulatedContent, citations } : msg
            )
          );
        }

        setStatus('success');
        const idleTimer = window.setTimeout(() => {
          setStatus('idle');
          setIsLoading(false);
        }, 900);
        timersRef.current.push(idleTimer);
      } catch (error) {
        console.error('API call error:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content:
                    'Sorry, I encountered an error connecting to the assistant. Please try again.',
                }
              : msg
          )
        );
        setStatus('idle');
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
    >
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-slate-800/50 px-6 py-6 sm:py-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-lg font-bold">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">IP-SAKTI Sahayak</h1>
              <p className="text-sm text-slate-400">Ayurveda IP & Regulatory Assistant</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            Your intelligent guide for intellectual property protection and regulatory compliance in
            Ayurvedic products
          </p>
        </motion.div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
          <AnimatePresence mode="wait" initial={false}>
            {messages.map((message, idx) => (
              <MessageDisplay key={`${message.id}-${idx}`} message={message} />
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                IP
              </div>
              <div className="bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-700/50">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="size-2 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-800/50 px-6 py-6 sm:py-8"
        >
          <AiPromptInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            disabled={isLoading}
            status={status}
            placeholder="Ask about patents, trademarks, GI protection, regulatory compliance..."
          />

          {/* Quick suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {[
              {
                icon: '📋',
                label: 'Patent Filing Process',
                query: 'How do I file a patent for my Ayurvedic formulation?',
              },
              {
                icon: '™️',
                label: 'Trademark Registration',
                query: "What's required for trademark registration?",
              },
              {
                icon: '🌍',
                label: 'GI Protection',
                query: 'How can I protect my product with GI status?',
              },
              {
                icon: '⚖️',
                label: 'Regulatory Compliance',
                query: 'What are the export regulations for Ayurvedic products?',
              },
            ].map((suggestion, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmit(suggestion.query)}
                disabled={isLoading}
                className={cn(
                  'text-left p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60',
                  'transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">{suggestion.icon}</span>
                  <span className="text-sm text-slate-300 leading-snug">{suggestion.label}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          <p className="text-xs text-slate-500 text-center mt-4">
            IP-SAKTI Sahayak • Powered by Ministry of Ayush • Always consult legal experts for
            official guidance
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
