'use client';

import { motion } from 'framer-motion';
import { Feature197, defaultIPFeatures } from '@/components/ui/accordion-feature-section';
import Link from 'next/link';
import { ArrowRight, Search, Cpu, Sparkles, Leaf, FlaskConical, BookOpen, Scale } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Powerful <span className="text-primary">Platform Features</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
            From natural language AI assistance to TKDL prior-art assessment and classical Ayurveda Samhita repositories—explore everything IP-SAKTI offers.
          </p>
        </motion.div>
      </section>

      {/* 21st.dev Accordion Feature Section (10 Core Features) */}
      <Feature197 features={defaultIPFeatures} />

      {/* RAG Deep-Dive Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div {...fadeInUp} className="mb-20 text-center max-w-3xl mx-auto">

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white leading-tight">
            Ground-Truth <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">RAG Architecture</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Our Retrieval-Augmented Generation pipeline grounds every answer in verified IP databases, TKDL references, and international AYUSH regulatory texts—ensuring precision at every layer.
          </p>
        </motion.div>

        {/* Animated Flow Diagram */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-3xl blur-2xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {[
              {
                title: '1. Retrieval',
                icon: Search,
                description:
                  'Queries over 50+ authoritative databases including Indian IP Office, TKDL, WIPO, USPTO, and classical text indexes.',
                items: ['Patent & GI Registries', 'TKDL Prior-Art Records', 'AYUSH Regulations', 'Classical Samhita Corpus'],
                color: 'from-blue-500/20 to-blue-500/5',
              },
              {
                title: '2. Augmentation',
                icon: Cpu,
                description:
                  'Domain-tuned context mapping cross-references Ayurvedic plant species, formulation methods, and patent eligibility criteria.',
                items: ['Section 3(p) Filter', 'Biological ABS Mapping', 'Multilingual Translation', 'Source Citation Verification'],
                color: 'from-purple-500/20 to-purple-500/5',
              },
              {
                title: '3. Generation',
                icon: Sparkles,
                description:
                  'Delivers precise, actionable, source-cited answers with clear confidence scoring for researchers and inventors.',
                items: ['Patentability Assessment', 'Filing Checklists', 'Compliance Reports', 'Export Market Analysis'],
                color: 'from-emerald-500/20 to-emerald-500/5',
              },
            ].map((stage, i) => {
              const IconComp = stage.icon;
              return (
                <motion.div
                  key={i}
                  {...fadeInUp}
                  transition={{ delay: i * 0.15 }}
                  className={`relative group`}
                >
                  {/* Connector Lines */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-primary/0 transform -translate-y-1/2" />
                  )}

                  <div className={`bg-gradient-to-br ${stage.color} border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 text-primary">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{stage.title}</h3>
                    <p className="text-gray-300 mb-6 text-sm leading-relaxed">{stage.description}</p>

                    <div className="space-y-3 pt-6 border-t border-white/10">
                      {stage.items.map((item, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          className="text-sm text-gray-300 flex items-center"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {item}
                        </motion.li>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { label: '50+', value: 'Data Sources' },
            { label: '99.8%', value: 'Accuracy Rate' },
            { label: '15+', value: 'Regulatory Regimes' },
            { label: '24/7', value: 'Real-time Updates' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-primary/40 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-bold text-primary mb-2">{stat.label}</p>
              <p className="text-gray-400 text-sm">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stakeholder Use Cases - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Who <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">IP-SAKTI</span> Serves
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Empowering Ayurvedic heritage through precision IP guidance for every stakeholder</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              role: 'Ayurvedic Practitioners & Vaidyas',
              icon: Leaf,
              color: 'border-emerald-500/30 bg-emerald-500/5',
              gradient: 'from-emerald-500/20 to-emerald-500/5',
              tasks: [
                'Document proprietary formulation lineages safely',
                'Check TKDL prior art before filing patent claims',
                'Navigate trademark protection for proprietary medicines',
              ],
            },
            {
              role: 'Pharma & Biotech Companies',
              icon: FlaskConical,
              color: 'border-blue-500/30 bg-blue-500/5',
              gradient: 'from-blue-500/20 to-blue-500/5',
              tasks: [
                'Map regulatory compliance across 15+ international regimes',
                'Conduct patentability assessment on extract modifications',
                'Manage Access & Benefit Sharing (ABS) compliance',
              ],
            },
            {
              role: 'Researchers & Academic Institutions',
              icon: BookOpen,
              color: 'border-purple-500/30 bg-purple-500/5',
              gradient: 'from-purple-500/20 to-purple-500/5',
              tasks: [
                'Identify unpatented Ayurvedic research gaps',
                'Accelerate prior-art literature reviews',
                'Formulate global IP protection & publication strategies',
              ],
            },
            {
              role: 'Regulatory & IP Consultants',
              icon: Scale,
              color: 'border-amber-500/30 bg-amber-500/5',
              gradient: 'from-amber-500/20 to-amber-500/5',
              tasks: [
                'Verify Section 3(p) Patent Act exemptions',
                'Verify classical formulation reference citations',
                'Streamline international export authorization reports',
              ],
            },
          ].map((useCase, i) => {
            const IconComp = useCase.icon;
            return (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group bg-gradient-to-br ${useCase.gradient} border ${useCase.color} rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative`}
              >
                {/* Animated background accent */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-300" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6 group-hover:text-primary transition-colors">{useCase.role}</h3>
                  <ul className="space-y-4">
                    {useCase.tasks.map((task, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.08 }}
                        className="text-gray-300 text-sm flex items-start group/item"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 shrink-0 group-hover/item:scale-125 transition-transform" />
                        <span className="group-hover/item:text-white transition-colors">{task}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Completely Redesigned */}
      <section className="relative py-28 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
                  Everything You Need to Protect IP
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  From Vaidyas documenting formulations to pharma companies navigating global regulations—IP-SAKTI gives you confidence in every step.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  { icon: '✓', title: 'AI-Powered Analysis', desc: 'Get instant patentability insights' },
                  { icon: '✓', title: 'TKDL Integrated', desc: 'Check against 50+ authoritative sources' },
                  { icon: '✓', title: 'Multi-Lingual Support', desc: 'Access guidance in your language' },
                  { icon: '✓', title: 'Regulatory Mapped', desc: '15+ international compliance frameworks' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - CTA Cards */}
            <motion.div {...fadeInUp} className="space-y-6">
              {/* AI Assistant Card */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border-2 border-primary/50 p-8 sm:p-10 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-300" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ask Our AI</h3>
                  <p className="text-gray-300 mb-6">Get instant answers on patentability, compliance, and IP protection strategies powered by verified data.</p>
                  <Link
                    href="/chat#chat-input"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 group-hover:gap-3"
                  >
                    Start Chatting
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Samhita Repository Card */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border-2 border-primary/50 p-8 sm:p-10 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-300" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Explore Samhita</h3>
                  <p className="text-gray-300 mb-6">Dive into classical Ayurvedic formulations, historical references, and IP protection guidelines in one place.</p>
                  <Link
                    href="/samhita"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 group-hover:gap-3"
                  >
                    Browse Repository
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}