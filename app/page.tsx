import { IPSaktiHero } from '@/components/ui/prisma-hero';
import { FAQSection } from '@/components/ui/faqsection';
import { HistoricalHeritageSection } from '@/components/ui/historical-heritage';
import Contact16 from '@/components/ui/contact-16';
import { LANGUAGES } from '@/lib/i18n/languages';
import Link from 'next/link';

const ayushFaqsLeft = [
  {
    question: '1. Can a traditional Ayurveda formulation be patented?',
    answer:
      'Traditional knowledge that is already publicly known generally cannot be patented as a new invention. However, a genuinely novel and inventive modification or application may require separate patentability assessment.',
  },
  {
    question: '2. What is TKDL?',
    answer:
      'The Traditional Knowledge Digital Library (TKDL) documents traditional Indian knowledge in a structured format. It helps prevent wrongful patent claims over knowledge that already exists in traditional sources.',
  },
  {
    question: '3. What is Access and Benefit Sharing (ABS)?',
    answer:
      'ABS refers to sharing benefits arising from the use of biological resources and associated traditional knowledge with the relevant providers or communities, according to applicable legal frameworks.',
  },
  {
    question: '4. What is Section 3(p) of the Patents Act, 1970?',
    answer:
      'Section 3(p) addresses inventions that are essentially traditional knowledge or an aggregation/duplication of known properties of traditionally known components, making them non-patentable under that provision.',
  },
  {
    question: '5. How can I determine whether my Ayurveda formulation is classical or proprietary?',
    answer:
      'You should check whether it comes from a recognized classical source and whether its ingredients, proportions, preparation method, route, or intended use have been substantially modified.',
  },
];

const ayushFaqsRight = [
  {
    question: '6. What if I modify a classical Ayurveda formulation?',
    answer:
      'A modification does not automatically make it patentable. Novelty, inventive contribution, evidence, and the applicable regulatory/IP framework must be assessed.',
  },
  {
    question: '7. What is the difference between IP protection and regulatory approval?',
    answer:
      'IP protection concerns rights such as patents, trademarks, and geographical indications. Regulatory approval concerns whether a product can legally be manufactured, marketed, or used for a particular purpose.',
  },
  {
    question: '8. Does international IP protection automatically apply in other countries?',
    answer:
      'No. Intellectual-property rights are generally territorial. Protection and requirements can differ between countries, although international agreements such as TRIPS establish certain common standards.',
  },
  {
    question: '9. What is the Nagoya Protocol?',
    answer:
      'The Nagoya Protocol is an international framework concerning access to genetic resources and fair and equitable sharing of benefits arising from their utilization.',
  },
  {
    question: '10. Can IP-SAKTI Sahayak provide legal advice?',
    answer:
      'No. IP-SAKTI Sahayak provides educational guidance based on its available sources. Its responses should not be treated as professional legal advice.',
  },
];

export default function Home() {
  return (
    <div className="w-full bg-black">
      {/* Hero Section */}
      <IPSaktiHero />

      {/* Quick Stats Section */}
      <section className="bg-black py-16 md:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">Corpus</div>
              <p className="text-gray-400">Ayurveda formulations analyzed</p>
            </div>

            <div className="text-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">Corpus</div>
              <p className="text-gray-400">Jurisdiction-filtered sources</p>
            </div>

            <div className="text-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {LANGUAGES.length}
              </div>
              <p className="text-gray-400">Languages Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section: Those Who Shaped the Tradition */}
      <HistoricalHeritageSection />

      <section className="bg-[#f7faf7] px-4 py-16 text-[#173b2b] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            More from IP-SAKTI
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore the knowledge layer
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [
                'ABS & TKDL',
                '/abs-tkdl',
                'Understand access, benefit sharing, and traditional knowledge checks.',
              ],
              ['Sources', '/sources', 'Browse the legal and regulatory corpus behind answers.'],
              ['Samhita', '/samhita', 'Explore Ayurveda knowledge, herbs, and formulations.'],
              ['Features', '/features', 'See what IP-SAKTI can do for research and protection.'],
              [
                'How It Works',
                '/how-it-works',
                'Follow the path from question to grounded guidance.',
              ],
            ].map(([title, href, description]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-[#173b2b]/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="font-semibold text-[#173b2b]">{title}</span>
                <span className="mt-2 block text-sm leading-6 text-[#173b2b]/60">
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Ayurveda IP & Regulatory FAQs"
        subtitle="Frequently Asked Questions"
        description="Clear guidance on traditional knowledge, patent eligibility, TKDL checks, and compliance rules."
        buttonLabel="Ask AI Assistant →"
        faqsLeft={ayushFaqsLeft}
        faqsRight={ayushFaqsRight}
      />

      {/* Contact Section (Replaces 'Protect Your Ayurveda IP Today' CTA section) */}
      <div className="py-12 border-t border-white/10">
        <Contact16 />
      </div>
    </div>
  );
}
