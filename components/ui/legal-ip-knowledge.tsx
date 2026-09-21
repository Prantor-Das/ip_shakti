'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Shield,
  BookOpen,
  Globe,
  Globe2,
  FileText,
  Building2,
  Share2,
  Lock,
  ChevronDown,
  Info,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';

export function LegalIpKnowledgeSection() {
  const [activeTopic, setActiveTopic] = useState<number>(1);
  const [activeJurisdiction, setActiveJurisdiction] = useState<'india' | 'usa' | 'eu' | 'china' | 'japan'>('india');

  const topics = [
    { id: 1, title: '1. Patent Laws & Patentability', icon: Scale },
    { id: 2, title: '2. Traditional Knowledge & IP Protection', icon: Shield },
    { id: 3, title: '3. TKDL & Prior-Art Protection', icon: BookOpen },
    { id: 4, title: '4. Access & Benefit-Sharing (ABS)', icon: Share2 },
    { id: 5, title: '5. Nagoya Protocol, PIC & MAT', icon: Globe },
    { id: 6, title: '6. India — Patents & Biodiversity Laws', icon: Building2 },
    { id: 7, title: '7. India — AYUSH Regulatory Framework', icon: FileText },
    { id: 8, title: '8. International — WIPO, TRIPS & PCT', icon: Globe2 },
    { id: 9, title: '9. Jurisdiction Comparison', icon: Award },
    { id: 10, title: '10. Biopiracy & Commercialization', icon: Lock },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#F3F7F3] border-b border-[#DADCE0]">
      <div className="samhita-container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0E9] text-[#2D5A3F] text-xs font-semibold tracking-wider uppercase mb-4 border border-[#477A5B]/20">
            <Scale className="w-3.5 h-3.5 text-[#477A5B]" />
            Legal, IP & Benefit-Sharing Framework
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#202124] mb-4">
            Legal, IP & Benefit-Sharing Knowledge Repository
          </h2>
          <p className="text-base md:text-lg text-[#5F6368] leading-relaxed">
            A comprehensive, source-cited guide covering patentability, TKDL prior art, Nagoya Protocol ABS compliance, and international IP regulations.
          </p>
        </div>

        {/* Horizontal Scrollable/Grid Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-[#DADCE0] pb-6">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#477A5B] text-white shadow-md'
                    : 'bg-[#FFFFFF] text-[#3C4043] border border-[#DADCE0] hover:border-[#477A5B] hover:text-[#477A5B]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Content Display Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#DADCE0] p-6 sm:p-10 md:p-12 shadow-sm">
          <AnimatePresence mode="wait">
            {activeTopic === 1 && (
              <motion.div key="topic-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-[#477A5B]" /> 1. Patent Laws & Patentability
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  Intellectual property laws establish strict criteria for patent eligibility. Understanding how novelty, inventive step, and exclusion rules apply to traditional knowledge is fundamental.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">What a Patent Protects</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      A patent grants an exclusive legal right to exclude others from making, using, selling, or importing an invention for a specified duration (typically 20 years), in exchange for public disclosure.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Core Criteria: Novelty & Inventive Step</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      <strong>Novelty:</strong> The invention must not form part of existing prior art.<br/>
                      <strong>Inventive Step:</strong> The solution must not be obvious to a person skilled in the art.<br/>
                      <strong>Industrial Applicability:</strong> Must be capable of industrial manufacture or use.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Exclusions for Traditional Knowledge</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Direct extractions, mere admixtures of known herbs, or duplication of known traditional properties are explicitly excluded from patentability under most legal systems (e.g. Section 3(p) of India's Patents Act).
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Examination & Prior-Art Documentation</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Applications undergo formal examination against worldwide prior art. Documenting pre-existing traditional knowledge ensures examiner visibility and prevents invalid patents.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 2 && (
              <motion.div key="topic-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#477A5B]" /> 2. Traditional Knowledge & IP Protection
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  Traditional Knowledge (TK) encompasses skills, innovations, and practices developed, sustained, and passed down within indigenous and local communities over centuries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Ayurveda as a TK System</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Ayurveda constitutes a codified traditional knowledge system with centuries of empirical observation, classical literature (Samhitas), and community heritage.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Defensive vs. Positive Protection</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      <strong>Defensive Protection:</strong> Stopping third parties from acquiring illegal patents over TK.<br/>
                      <strong>Positive Protection:</strong> Empowering communities to assert rights, grant consent, and commercialize knowledge directly.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Community Ownership & Ethics</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Ensuring traditional knowledge documentation respects community ownership, customary laws, and ethical participation frameworks.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Historical IP Disputes</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Landmark international patent revocations (e.g., Turmeric patent US5401504, Neem patent EPO 436257) demonstrated the necessity of establishing global prior-art records.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 3 && (
              <motion.div key="topic-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#477A5B]" /> 3. TKDL & Prior-Art Protection
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  The Traditional Knowledge Digital Library (TKDL) is a pioneering Indian digital archive initiated to safeguard traditional medicine knowledge from misappropriation.
                </p>

                {/* Highlight Banner */}
                <div className="p-5 rounded-2xl bg-[#E8F0E9] border border-[#477A5B]/30 mb-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2D5A3F] leading-relaxed">
                    <strong>WIPO Official Reference:</strong> WIPO describes TKDL as an Indian initiative established in 2001 and notes that its database contains more than <strong>360,000 formulations and practices</strong> across Ayurveda, Siddha, Unani, and Yoga.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Purpose & Creation</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Established in 2001 jointly by CSIR and Ministry of AYUSH to translate classical texts into five international languages (English, French, German, Japanese, Spanish) using Traditional Knowledge Resource Classification (TKRC).
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Patent-Office Access Agreements</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      International patent offices (USPTO, EPO, JPO, KIPO, CGPDTM) access TKDL under non-disclosure access agreements exclusively for patent search and examination.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 4 && (
              <motion.div key="topic-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-[#477A5B]" /> 4. Access & Benefit-Sharing (ABS)
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  Access and Benefit-Sharing (ABS) ensures that benefits derived from using biological resources and associated traditional knowledge are shared fairly with provider countries and indigenous communities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">PIC & MAT Fundamentals</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      <strong>Prior Informed Consent (PIC):</strong> Approval obtained from national competent authorities and local communities before accessing resources.<br/>
                      <strong>Mutually Agreed Terms (MAT):</strong> Contractual agreement defining usage terms and benefit-sharing mechanisms.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Monetary & Non-Monetary Benefits</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      <strong>Monetary:</strong> Upfront payments, milestone payments, royalties, license fees.<br/>
                      <strong>Non-Monetary:</strong> Capacity building, joint research, technology transfer, local employment, infrastructure support.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 5 && (
              <motion.div key="topic-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-[#477A5B]" /> 5. Nagoya Protocol, PIC & MAT
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  The Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits Arising from their Utilization is a supplementary agreement to the Convention on Biological Diversity (CBD).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Scope & Objectives</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Applies to genetic resources and associated traditional knowledge, providing a transparent legal framework for compliance, monitoring, and benefit-sharing across borders.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Commercialization & Compliance</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Researchers and corporate entities must verify ABS compliance certificates (IRCC) at checkpoint institutions before launching products in global markets.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 6 && (
              <motion.div key="topic-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#477A5B]" /> 6. India — Patents & Biological Diversity Laws
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  India’s legal framework tightly links intellectual property registration with biodiversity conservation laws.
                </p>

                {/* Important Timely Note */}
                <div className="p-5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] mb-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#F57F17] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5D4037] leading-relaxed">
                    <strong>Legislative Version Notice (WIPO Lex):</strong> India's biodiversity framework underwent major statutory changes: WIPO Lex records the <strong>Biological Diversity Rules, 2024</strong> and notes the <strong>2023 Amendment to the Biological Diversity Act</strong>, as well as subsequent <strong>2025 rule amendments</strong>. Regulations reflect active statutory updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Patents Act, 1970 & Section 3(p)</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Section 3(p) excludes inventions that are essentially traditional knowledge. Section 6(1) requires applicants utilizing Indian biological resources to seek National Biodiversity Authority (NBA) approval before patent grant.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Biological Diversity Act & Authorities</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Governed by National Biodiversity Authority (NBA), State Biodiversity Boards (SBB), and local Biodiversity Management Committees (BMC).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 7 && (
              <motion.div key="topic-7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#477A5B]" /> 7. India — AYUSH Regulatory Framework
                </h3>

                {/* Ministry Note */}
                <div className="p-5 rounded-2xl bg-[#E8F0E9] border border-[#477A5B]/30 mb-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2D5A3F] leading-relaxed">
                    <strong>Ministry Statement:</strong> The Ministry of AYUSH confirms that regulation of Ayurveda, Siddha, Unani, and Homoeopathic medicines operates under the <strong>Drugs & Cosmetics Act, 1940</strong> and its associated Rules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Drugs & Cosmetics Act & Rules</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Enforces statutory standards for Ayurvedic drugs under Schedule T (Good Manufacturing Practices - GMP), quality testing, manufacturing licenses, and labeling requirements.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Classical vs. Patent / Proprietary Medicines</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Distinguishes classical formulations listed in authoritative texts (First Schedule) from Patent or Proprietary (P&P) Ayurvedic medicines requiring safety and efficacy proof.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 8 && (
              <motion.div key="topic-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Globe2 className="w-6 h-6 text-[#477A5B]" /> 8. International Frameworks — WIPO, TRIPS & PCT
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  International treaties establish global benchmarks for intellectual property enforcement while offering international application filing routes.
                </p>

                {/* PCT Note */}
                <div className="p-5 rounded-2xl bg-[#E8F0E9] border border-[#477A5B]/30 mb-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2D5A3F] leading-relaxed">
                    <strong>PCT Clarification:</strong> The Patent Cooperation Treaty (PCT) allows an applicant to pursue patent protection internationally through one application before entering national/regional phases; the international search provides relevant prior-art information but <strong>does not itself grant a worldwide patent</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">WIPO</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      World Intellectual Property Organization leads the IGC committee on Intellectual Property and Genetic Resources, Traditional Knowledge and Folklore.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">TRIPS Agreement</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      WTO TRIPS sets minimum standards for IP protection, subject-matter eligibility, and enforcement procedures across member nations.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">PCT System</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Filing a single PCT application facilitates prior-art searching and examination before entering individual national phase patent grants.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTopic === 9 && (
              <motion.div key="topic-9" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#477A5B]" /> 9. Jurisdiction Comparison
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  Compare IP, traditional knowledge, biodiversity/ABS, and regulatory frameworks across key global jurisdictions.
                </p>

                {/* Jurisdiction Selector Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    { id: 'india', flag: '🇮🇳', name: 'India' },
                    { id: 'usa', flag: '🇺🇸', name: 'USA' },
                    { id: 'eu', flag: '🇪🇺', name: 'European Union' },
                    { id: 'china', flag: '🇨🇳', name: 'China' },
                    { id: 'japan', flag: '🇯🇵', name: 'Japan' },
                  ].map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setActiveJurisdiction(j.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeJurisdiction === j.id
                          ? 'bg-[#477A5B] text-white shadow'
                          : 'bg-[#F8F9FA] text-[#3C4043] border border-[#DADCE0] hover:border-[#477A5B]'
                      }`}
                    >
                      {j.flag} {j.name}
                    </button>
                  ))}
                </div>

                {/* Standardized Jurisdiction Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {activeJurisdiction === 'india' && (
                    <>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">PATENT FRAMEWORK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Patents Act, 1970</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Includes Section 3(p) exclusion for traditional knowledge & Section 6 NBA approval requirement.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">TK PROTECTION</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">TKDL & Prior-Art Records</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Defensive protection via 360,000+ codified classical database entries.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">BIODIVERSITY / ABS</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Biological Diversity Act (2023/2024 Rules)</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Mandatory NBA/SBB clearance for biological resource access & benefit sharing.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">AYUSH REGULATION</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Drugs & Cosmetics Act, 1940</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Schedule T GMP compliance & AYUSH manufacturing licensing.</p>
                      </div>
                    </>
                  )}

                  {activeJurisdiction === 'usa' && (
                    <>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">PATENT FRAMEWORK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">USPTO (35 U.S.C.)</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Utility patents require non-obviousness & written description enablement.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">BIOLOGICAL INVENTIONS</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Myriad / Mayo Precedents</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Naturally occurring products as such are not patent-eligible subject matter.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">TK CONSIDERATIONS</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">TKDL Examiner Access</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">USPTO examiners consult TKDL for prior art during search phase.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">REGULATORY PATHWAY</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">US FDA (Dietary Supplements / NDI)</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Regulated under DSHEA 1994 as dietary supplements or botanical drugs.</p>
                      </div>
                    </>
                  )}

                  {activeJurisdiction === 'eu' && (
                    <>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">PATENT FRAMEWORK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">European Patent Convention (EPC)</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Art 53(a) & 54 EPC prior art rules evaluated by European Patent Office.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">GENETIC RESOURCES & TK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">EU ABS Regulation 511/2014</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Mandatory due diligence compliance for genetic resource utilization.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">ABS REQUIREMENTS</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Nagoya Protocol Due Diligence</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Declarations required at funding and final product development stages.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">REGULATORY PATHWAY</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">EMA Herbal Medicinal Products</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC).</p>
                      </div>
                    </>
                  )}

                  {activeJurisdiction === 'china' && (
                    <>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">PATENT FRAMEWORK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">CNIPA Patent Law</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Article 5 & 26 disclosure requirements for genetic/traditional resource origin.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">TRADITIONAL MEDICINE / IP</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">TCM Protection Regulations</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Specialized protection certification for Traditional Chinese Medicine (TCM).</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">GENETIC-RESOURCE / TK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Mandatory Origin Disclosure</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Patent invalidation risk if genetic resource acquisition violated domestic law.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">REGULATORY PATHWAY</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">NMPA Regulation</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">National Medical Products Administration registration for TCM formulas.</p>
                      </div>
                    </>
                  )}

                  {activeJurisdiction === 'japan' && (
                    <>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">PATENT FRAMEWORK</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">JPO Patent Act</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Specific examination guidelines for Kampo and botanical medicine inventions.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">TRADITIONAL MEDICINE / IP</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">Kampo Formulations</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Codified Kampo formulas examined against traditional literature prior art.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">BIODIVERSITY / ABS</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">MOE ABS Guidelines</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Ministry of the Environment guidelines on Nagoya Protocol implementation.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#477A5B]">REGULATORY PATHWAY</span>
                        <h4 className="font-bold text-[#202124] text-sm mt-1 mb-2">PMDA Approval</h4>
                        <p className="text-xs text-[#5F6368] leading-relaxed">Pharmaceuticals and Medical Devices Agency approval for OTC Kampo products.</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTopic === 10 && (
              <motion.div key="topic-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-bold text-[#202124] mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#477A5B]" /> 10. Biopiracy, Licensing & Commercialization
                </h3>
                <p className="text-sm text-[#5F6368] mb-6 leading-relaxed">
                  Preventing illegal misappropriation of biological knowledge while supporting ethical commercialization and technology transfer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Biopiracy Prevention</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Biopiracy refers to the unauthorized commercial exploitation or patenting of biological resources and traditional knowledge without consent or benefit-sharing.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                    <h4 className="font-bold text-[#202124] text-base mb-2">Licensing & Technology Transfer</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      Ethical technology transfer agreements ensure fair royalty sharing, research collaboration, and compliance with local biodiversity authorities before commercial launch.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
