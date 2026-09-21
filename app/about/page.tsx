'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Database,
  FileSearch,
  Globe2,
  HeartHandshake,
  Leaf,
  Languages,
  Lightbulb,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Contact16 from '@/components/ui/contact-16';

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
  viewport: { once: true, margin: '-80px' },
};

// Merged real team members with teammate's color tones & initial design
const teamMembers = [
  { name: 'Prasoon Kumar', role: 'Project Lead & Presentation', initials: 'PK', tone: 'bg-[#dcefe1] text-[#2f855a]' },
  { name: 'Yash Prabhakar', role: 'Frontend Development & Product Design', initials: 'YP', tone: 'bg-[#fff0df] text-[#c26726]' },
  { name: 'Shashank Gupta', role: 'UI/UX Design & Frontend Development', initials: 'SG', tone: 'bg-[#e8e3f5] text-[#6d5aa7]' },
  { name: 'Prantor Das', role: 'Backend Development', initials: 'PD', tone: 'bg-[#e2f0f0] text-[#287779]' },
  { name: 'Prajakta Sarkhel', role: 'Full-Stack Development', initials: 'PS', tone: 'bg-[#f8e7e7] text-[#a84e5a]' },
  { name: 'Princi Kumari', role: 'UI/UX Design & Media', initials: 'PK', tone: 'bg-[#f3ecd8] text-[#98752b]' },
];

const problems = [
  'Traditional knowledge is rich, but its protection pathways are difficult to navigate.',
  'IP laws, regulatory rules, and market requirements are scattered across many sources.',
  'Practitioners and innovators often need guidance in a language they use every day.',
  'Unclear documentation can make strong ideas harder to defend or take to market.',
];

const solutions = [
  { icon: FileSearch, title: 'One guided starting point', text: 'Ask a question in plain language and get a structured path instead of a pile of disconnected links.' },
  { icon: Database, title: 'Evidence brought together', text: 'RAG-based retrieval connects the conversation with relevant laws, cases, records, and regulatory sources.' },
  { icon: Globe2, title: 'Context that travels', text: 'Multilingual support and Ayurveda-aware explanations make the guidance more useful across regions.' },
  { icon: ShieldCheck, title: 'Clear next actions', text: 'Source-cited recommendations help you understand what to document, verify, discuss, or do next.' },
];

const visionPillars = [
  { icon: FileSearch, title: 'Source-cited by design', text: 'Every answer points back to the Act, rule, or record it rests on, so users can verify it instead of taking it on trust.' },
  { icon: Languages, title: 'Multilingual access', text: 'Guidance in the languages practitioners already work in, with Ayurvedic terminology kept intact.' },
  { icon: Globe2, title: 'National and international regimes', text: 'Indian law and international frameworks are kept clearly separate, so rules from one regime are never mixed into another.' },
  { icon: ShieldCheck, title: 'Guidance, not legal advice', text: 'Transparent about what it cannot answer, and built to help users prepare the right questions for an IP professional.' },
];

const techStack = [
  { name: 'Next.js', category: 'Application framework', icon: Code2 },
  { name: 'React', category: 'Interface layer', icon: Sparkles },
  { name: 'Tailwind CSS', category: 'Design system', icon: Leaf },
  { name: 'Framer Motion', category: 'Interaction & motion', icon: Lightbulb },
  { name: 'RAG + AI', category: 'Knowledge retrieval', icon: BrainCircuit },
  { name: 'Lucide Icons', category: 'Accessible UI icons', icon: HeartHandshake },
];

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7faf7] text-[#173b2b]">
      {/* Hero */}
      <section className="relative border-b border-[#173b2b]/10 px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-[#dcefe1] blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-[#fff0df] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
          <motion.div {...fadeInUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f855a]/20 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f855a]"><Leaf className="h-3.5 w-3.5" /> Why IP-SAKTI exists</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Protecting knowledge with <span className="font-serif italic text-[#2f855a]">care.</span></h1>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.12, duration: 0.55 }}>
            <p className="text-xl leading-8 text-[#173b2b]/65">IP-SAKTI Sahayak helps Ayurveda innovators understand intellectual property and regulatory pathways without losing the context, language, or heritage behind their work.</p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[#2f855a]"><span className="h-px w-10 bg-[#2f855a]/40" />A bridge between traditional knowledge and modern protection</div>
          </motion.div>
        </div>
      </section>

      {/* Purpose */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <motion.div {...fadeInUp}><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">Our point of view</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">Good protection starts with better understanding.</h2></motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.08, duration: 0.55 }} className="space-y-6 text-lg leading-8 text-[#173b2b]/65"><p>Ayurvedic knowledge carries generations of observation, practice, and cultural memory. Yet the people working with it often face systems that are difficult to navigate: unfamiliar legal language, fragmented sources, and rules that change from one market to the next.</p><p>We are building IP-SAKTI to make that first layer of understanding more accessible. It brings relevant evidence together, explains it in plain language, and helps people identify the right next question before they make a high-stakes decision.</p></motion.div>
        </div>
      </section>

      {/* Problem and solution */}
      <section className="border-y border-[#173b2b]/10 bg-[#edf6ef] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">From friction to direction</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">A better response to a real problem.</h2><p className="mt-5 text-lg leading-8 text-[#173b2b]/60">The goal is not to make legal decisions for people. It is to make the path to an informed decision clearer, more transparent, and more human.</p></motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <motion.div {...fadeInUp} className="rounded-[1.6rem] bg-[#173b2b] p-8 text-white sm:p-10"><div className="flex items-center gap-3 text-[#f1c178]"><span className="rounded-xl bg-white/10 p-2"><Scale className="h-5 w-5" /></span><span className="text-xs font-bold uppercase tracking-[0.18em]">The problem</span></div><h3 className="mt-8 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">Important knowledge should not be difficult to defend.</h3><ul className="mt-8 space-y-4">{problems.map((problem) => <li key={problem} className="flex items-start gap-3 text-sm leading-6 text-white/80"><span className="mt-1 rounded-full bg-[#f1c178]/20 p-0.5"><Check className="h-3 w-3 text-[#f1c178]" /></span>{problem}</li>)}</ul></motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.08, duration: 0.55 }} className="rounded-[1.6rem] border border-[#2f855a]/20 bg-[#dcefe1] p-8 text-[#173b2b] sm:p-10"><div className="flex items-center gap-3 text-[#2f855a]"><span className="rounded-xl bg-white/70 p-2"><Sparkles className="h-5 w-5" /></span><span className="text-xs font-bold uppercase tracking-[0.18em]">The solved approach</span></div><h3 className="mt-8 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173b2b] sm:text-4xl">A calmer, clearer way to find direction.</h3><p className="mt-5 max-w-md text-base leading-7 text-[#173b2b]/70">IP-SAKTI combines retrieval, multilingual AI, and Ayurveda-aware context to turn a complicated starting point into a practical conversation.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/80 p-4"><p className="text-2xl font-semibold text-[#2f855a]">50+</p><p className="mt-1 text-xs text-[#173b2b]/65">authoritative source types</p></div><div className="rounded-2xl bg-white/80 p-4"><p className="text-2xl font-semibold text-[#2f855a]">6</p><p className="mt-1 text-xs text-[#173b2b]/65">languages supported</p></div></div></motion.div>
          </div>
        </div>
      </section>

      {/* Solution cards */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl"><motion.div {...fadeInUp} className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">What IP-SAKTI changes</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">From scattered information to a useful next step.</h2></motion.div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{solutions.map((solution, i) => { const Icon = solution.icon; return <motion.article key={solution.title} {...fadeInUp} transition={{ delay: i * 0.06 }} className="rounded-[1.35rem] border border-[#173b2b]/10 bg-white p-6 shadow-[0_10px_30px_rgba(23,59,43,0.04)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2e9] text-[#2f855a]"><Icon className="h-5 w-5" /></div><h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">{solution.title}</h3><p className="mt-3 text-sm leading-6 text-[#173b2b]/60">{solution.text}</p></motion.article>; })}</div></div>
      </section>

      {/* Team */}
      <section className="border-t border-[#173b2b]/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl"><motion.div {...fadeInUp} className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">The people behind the project</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Built by a team that cares about the details.</h2><p className="mt-5 text-lg leading-8 text-[#173b2b]/60">Dedicated engineers, designers, and researchers working on IP-SAKTI Sahayak for Smart India Hackathon 2026.</p></motion.div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{teamMembers.map((member, i) => <motion.article key={member.name} {...fadeInUp} transition={{ delay: i * 0.06 }} className="group rounded-[1.35rem] border border-[#173b2b]/10 bg-white p-6 shadow-[0_10px_30px_rgba(23,59,43,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,59,43,0.1)]"><div className="flex items-center justify-between"><div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold ${member.tone}`}>{member.initials}</div><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#173b2b]/25">IP-SAKTI</span></div><h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">{member.name}</h3><p className="mt-2 text-sm text-[#2f855a]">{member.role}</p><div className="mt-6 flex items-center gap-2 border-t border-[#173b2b]/10 pt-4 text-xs text-[#173b2b]/45"><LockKeyhole className="h-3.5 w-3.5" /> Contributor profile</div></motion.article>)}</div></div>
      </section>

      {/* Stack */}
      <section className="border-y border-[#173b2b]/10 bg-[#f1f7f2] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl"><motion.div {...fadeInUp} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f855a]">Under the hood</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">A thoughtful stack for a meaningful problem.</h2></div><p className="max-w-sm text-sm leading-6 text-[#173b2b]/60">We use modern web, AI, and design tools to keep the experience fast, understandable, and ready to grow.</p></motion.div><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{techStack.map((tech, i) => { const Icon = tech.icon; return <motion.div key={tech.name} {...fadeInUp} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-2xl border border-[#173b2b]/10 bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f2e9] text-[#2f855a]"><Icon className="h-5 w-5" /></div><div><h3 className="font-semibold">{tech.name}</h3><p className="mt-1 text-xs text-[#173b2b]/55">{tech.category}</p></div></motion.div>; })}</div></div>
      </section>

      {/* Vision */}
      <section className="px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
        <motion.div {...fadeInUp} className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] bg-[#173b2b] p-8 text-white sm:p-12 lg:p-14">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[#b7dfbf]"><Leaf className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.18em]">The vision</span></div>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">Every Ayurveda innovator, in their own language, one source-cited answer away from the right path.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">IP-SAKTI Sahayak is our response to SIH 2026 Problem Statement 26045 from the Ministry of Ayush: a multilingual, RAG-based assistant that gives source-cited guidance on intellectual property and regulatory questions in Ayurveda, across national and international regimes. We want protecting traditional knowledge to depend on the strength of an idea, not on who can navigate scattered statutes and jargon.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/how-it-works" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#b7dfbf] px-5 py-3 text-sm font-bold text-[#173b2b] transition-transform hover:-translate-y-0.5">See how it works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/chat" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b7dfbf]/40 px-5 py-3 text-sm font-semibold text-[#b7dfbf] transition-colors hover:bg-[#b7dfbf]/10">Try the assistant</Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-[#b7dfbf]/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {visionPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-2xl border border-[#b7dfbf]/15 bg-[#1f4a37] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b7dfbf]/15 text-[#b7dfbf]"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-base font-semibold leading-snug text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{pillar.text}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-white/50">Built for Smart India Hackathon 2026 · Problem Statement SIH26045 · Ministry of Ayush</p>
        </motion.div>
      </section>

      {/* Direct Email Contact Section */}
      <Contact16 />
    </div>
  );
}
