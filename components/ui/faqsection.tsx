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
  const maxRows = Math.max(faqsLeft.length, faqsRight.length);

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

      {/* FAQs — row-by-row so left & right questions always share the same row height */}
      <div className="flex flex-col border-t border-white/10">
        {Array.from({ length: maxRows }).map((_, rowIndex) => {
          const leftFaq = faqsLeft[rowIndex];
          const rightFaq = faqsRight[rowIndex];
          return (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10"
            >
              {/* Left FAQ */}
              <div className="md:border-r md:border-white/10 md:pr-8 py-5 flex flex-col justify-center min-h-[72px]">
                {leftFaq ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`left-${rowIndex}`} className="border-none">
                      <AccordionTrigger className="text-base font-medium text-white hover:text-primary py-0 text-left">
                        {leftFaq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-3 pb-0">
                        {leftFaq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </div>

              {/* Right FAQ */}
              <div className="md:pl-8 py-5 flex flex-col justify-center min-h-[72px]">
                {rightFaq ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`right-${rowIndex}`} className="border-none">
                      <AccordionTrigger className="text-base font-medium text-white hover:text-primary py-0 text-left">
                        {rightFaq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-3 pb-0">
                        {rightFaq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
