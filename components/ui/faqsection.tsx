'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  faqsLeft: FAQItem[];
  faqsRight: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = 'Ayurveda IP & Regulatory Help',
  subtitle = 'Frequently Asked Questions',
  description = 'Get instant answers to key questions about patent eligibility, TKDL prior art, AYUSH compliance, and international IP regulations.',
  buttonLabel = 'Ask AI Assistant →',
  buttonHref = '/chat#chat-input',
  onButtonClick,
  faqsLeft,
  faqsRight,
  className,
}: FAQSectionProps) {
  return (
    <section id="faq" className={cn('w-full max-w-5xl mx-auto py-16 px-4 text-white scroll-mt-20', className)}>
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm text-primary font-medium tracking-wide mb-2">{subtitle}</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-6 text-sm md:text-base">{description}</p>
        {buttonLabel && (
          <Link href={buttonHref}>
            <Button
              variant="default"
              className="rounded-full bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90 transition-colors px-6"
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          </Link>
        )}
      </div>

      {/* FAQs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
          <Accordion key={columnIndex} type="single" collapsible className="space-y-4">
            {faqColumn.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${columnIndex}-${i}`}
                className="border-b border-white/10"
              >
                <AccordionTrigger className="text-base font-medium text-white hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300 leading-relaxed">
                  <div className="min-h-[40px] transition-all duration-200 ease-in-out py-1">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
