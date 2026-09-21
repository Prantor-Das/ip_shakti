'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Database,
  FileText,
  Languages,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
  viewport: { once: true, margin: '-80px' },
};

const steps = [
  {
    number: '01',
    kicker: 'Start with context',
    title: 'Tell us what you are building',
    description:
      'Share your formulation, product idea, target market, or IP question in the language that feels most natural to you.',
    details: ['Formulation details', 'Target markets', 'Regulatory concerns'],
    icon: FileText,
    color: 'bg-[#e6f2e9] text-[#2f855a]',
  },
  {
    number: '02',
    kicker: 'Search the right sources',
    title: 'We map the evidence',
    description:
      'IP-SAKTI searches across laws, regulatory frameworks, traditional knowledge records, and relevant case precedents.',
    details: ['Multi-source retrieval', 'Regulatory mapping', 'Precedent analysis'],
    icon: Search,
    color: 'bg-[#fff0df] text-[#c26726]',
  },
  {
    number: '03',
    kicker: 'Make it relevant',
    title: 'AI adds the Ayurveda context',
    description:
      'Your results are enriched with domain knowledge so complex legal and compliance information is easier to understand and act on.',
    details: ['Domain expertise', 'Market analysis', 'Competitive positioning'],
    icon: Sparkles,
    color: 'bg-[#e8e3f5] text-[#6d5aa7]',
  },
  {
    number: '04',
    kicker: 'Leave with a direction',
    title: 'Get guidance you can use',
    description:
      'Receive practical next steps with source citations, clear assumptions, and a roadmap you can take to your team or IP counsel.',
    details: ['Source-cited report', 'Actionable recommendations', 'Implementation roadmap'],
    icon: ShieldCheck,
    color: 'bg-[#e2f0f0] text-[#287779]',
  },
];

const faqs = [
  {
    q: "How accurate is IP-SAKTI's guidance?",
    a: 'Recommendations are grounded in authoritative IP and regulatory sources. Use the output as educational guidance and consult an IP specialist for final legal decisions.',
  },
  {
    q: 'Which languages are supported?',
    a: 'IP-SAKTI supports English, Hindi, Sanskrit, Tamil, Telugu, Marathi, and Bengali, with more regional languages planned.',
  },
  {
    q: 'Is my formulation data secure?',
    a: 'Submissions are encrypted and handled securely. You can request deletion, and your information is not shared with third parties.',
  },
  {
    q: 'Can I export the guidance?',
    a: 'Yes. Reports can be exported as PDF for documentation, filing preparation, or sharing with your IP counsel.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7faf7] text-[#173b2b]">
      {/* Intro */}
      <section className="relative border-b border-[#173b2b]/10 px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -right-40 top-16 h-96 w-96 rounded-full bg-[#dcefe1] blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#fff0df] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <motion.div {...fadeInUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f855a]/20 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f855a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2f855a]" />
              A clearer way forward
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              From a question to a confident <span className="font-serif italic text-[#2f855a]">next step.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#173b2b]/65 sm:text-xl">
              IP-SAKTI turns complex Ayurveda IP and regulatory questions into a guided, source-backed process your team can actually follow.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4 text-sm font-semibold">
              <a href="#process" className="group inline-flex items-center gap-3 rounded-full bg-[#2f855a] px-5 py-3 text-white shadow-lg shadow-[#2f855a]/15 transition-transform hover:-translate-y-0.5">
                See the four steps
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <span className="text-[#173b2b]/45">Built for Ayurveda innovators</span>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.12, duration: 0.6 }} className="relative">
            <div className="absolute -inset-5 rounded-[2rem] border border-[#2f855a]/10 bg-white/35 rotate-3" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#173b2b]/10 bg-white p-5 shadow-[0_24px_80px_rgba(23,59,43,0.12)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#173b2b]/10 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2f855a]">Live guidance flow</p>
                  <p className="mt-1 text-lg font-semibold">Your question, mapped.</p>
                </div>
                <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f1b05d]" /><span className="h-2 w-2 rounded-full bg-[#7ac48b]" /><span className="h-2 w-2 rounded-full bg-[#b9d7c0]" /></div>
              </div>
              <div className="space-y-3 py-6">
                <div className="rounded-2xl bg-[#f4f8f4] p-4">
                  <div className="flex items-start gap-3"><div className="rounded-xl bg-white p-2 text-[#2f855a] shadow-sm"><FileText className="h-4 w-4" /></div><div><p className="text-xs font-semibold text-[#173b2b]/45">YOUR QUESTION</p><p className="mt-1 text-sm font-medium leading-6">Can this classical formulation be protected in a new market?</p></div></div>
                </div>
                <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-[#2f855a]" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#173b2b]/10 p-4"><Database className="h-4 w-4 text-[#c26726]" /><p className="mt-3 text-xs font-semibold text-[#173b2b]/45">SOURCES</p><p className="mt-1 text-sm font-semibold">14 records found</p></div>
                  <div className="rounded-2xl border border-[#173b2b]/10 p-4"><Languages className="h-4 w-4 text-[#6d5aa7]" /><p className="mt-3 text-xs font-semibold text-[#173b2b]/45">CONTEXT</p><p className="mt-1 text-sm font-semibold">Ayurveda + IP</p></div>
                </div>
                <div className="rounded-2xl bg-[#173b2b] p-4 text-white"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b7dfbf]">Recommended direction</p><Check className="h-4 w-4 text-[#b7dfbf]" /></div><p className="mt-2 text-sm leading-6 text-white/80">Review novelty, market-specific requirements, and evidence before filing.</p></div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#173b2b]/10 pt-5 text-xs text-[#173b2b]/50"><LockKeyhole className="h-3.5 w-3.5" /> Source-cited. Secure. Designed for decisions.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="mb-14 max-w-2xl lg:mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">The process</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Simple on the surface.<br /><span className="font-serif italic text-[#2f855a]">Serious underneath.</span></h2>
            <p className="mt-5 text-lg leading-8 text-[#173b2b]/60">Each step removes guesswork while keeping the evidence visible, so you can move from exploration to action with clarity.</p>
          </motion.div>

          <div className="relative grid gap-5 lg:grid-cols-4 lg:gap-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#2f855a]/20 lg:block" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.article key={step.number} {...fadeInUp} transition={{ delay: i * 0.08, duration: 0.55 }} className="relative flex flex-col rounded-[1.35rem] border border-[#173b2b]/10 bg-white p-6 shadow-[0_10px_30px_rgba(23,59,43,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,59,43,0.1)] lg:min-h-[390px]">
                  <div className="relative z-10 flex items-center justify-between"><div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}><Icon className="h-7 w-7" /></div><span className="text-5xl font-semibold tracking-[-0.08em] text-[#173b2b]/10">{step.number}</span></div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#2f855a]">{step.kicker}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#173b2b]/60">{step.description}</p>
                  <ul className="mt-auto space-y-2 border-t border-[#173b2b]/10 pt-5">
                    {step.details.map((detail) => <li key={detail} className="flex items-center gap-2 text-xs font-medium text-[#173b2b]/65"><Check className="h-3.5 w-3.5 text-[#2f855a]" />{detail}</li>)}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-y border-[#173b2b]/10 bg-[#edf6ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3 sm:gap-0">
          {[['50+', 'authoritative IP sources'], ['6', 'languages supported'], ['1', 'clearer path forward']].map(([value, label], i) => <div key={label} className={`text-center ${i > 0 ? 'border-t border-[#173b2b]/10 pt-8 sm:border-l sm:border-t-0 sm:pt-0' : ''}`}><p className="text-5xl font-semibold tracking-[-0.06em] text-[#2f855a]">{value}</p><p className="mt-2 text-sm text-[#173b2b]/55">{label}</p></div>)}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="mb-12 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">Good to know</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Questions, answered.</h2></motion.div>
          <div className="grid gap-4 md:grid-cols-2">{faqs.map((faq, i) => <motion.div key={faq.q} {...fadeInUp} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-[#173b2b]/10 bg-white p-6"><h3 className="text-base font-semibold leading-6">{faq.q}</h3><p className="mt-3 text-sm leading-6 text-[#173b2b]/60">{faq.a}</p></motion.div>)}</div>
          <motion.div {...fadeInUp} className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl bg-[#173b2b] p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <div>
              <p className="text-2xl font-semibold text-white-force">
                Ready to explore your next step?
              </p>
              <p className="mt-2 text-sm text-white-muted-force">
                Bring your question. We’ll help you find the signal.
              </p>
            </div>
            <a href="/chat" className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#b7dfbf] px-5 py-3 text-sm font-bold text-[#173b2b] transition-transform hover:-translate-y-0.5">
              Start a conversation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
