'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  FileText,
  Leaf,
  CheckCircle,
  ArrowRight,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { SAMHITA_ENTRIES } from '@/lib/samhita-data';

export default function SamhitaEntryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const entry = SAMHITA_ENTRIES.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#202124] pt-32 pb-16 font-sans">
        <div className="samhita-container text-center py-20">
          <h1 className="text-3xl font-bold text-[#202124] mb-4">Record Not Found</h1>
          <p className="text-sm text-[#5F6368] mb-8">
            The knowledge entry you are looking for does not exist in the repository.
          </p>
          <Link
            href="/samhita"
            className="px-5 py-2.5 bg-[#477A5B] text-white text-xs font-semibold rounded-xl hover:bg-[#396248] transition-colors"
          >
            Back to Samhita Repository
          </Link>
        </div>
      </div>
    );
  }

  // Related knowledge items
  const relatedItems = SAMHITA_ENTRIES.filter((e) =>
    entry.relatedKnowledgeSlugs.includes(e.slug)
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] pt-24 pb-16 font-sans">
      {/* BREADCRUMB HEADER */}
      <div className="bg-[#F8F9FA] border-b border-[#DADCE0] py-4">
        <div className="samhita-container flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/samhita"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#477A5B] hover:text-[#2D5A3F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Samhita Repository
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#5F6368]">
            <span>Samhita</span>
            <span>/</span>
            <span className="capitalize">{entry.category.toLowerCase()}</span>
            <span>/</span>
            <span className="text-[#202124] font-medium">{entry.commonName}</span>
          </div>
        </div>
      </div>

      {/* HERO / SUMMARY HEADER */}
      <section className="py-12 bg-[#FFFFFF] border-b border-[#DADCE0]">
        <div className="samhita-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Metadata & Titles */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F7F3] text-[#2D5A3F] text-xs font-semibold mb-4 border border-[#DADCE0]">
                <Leaf className="w-3.5 h-3.5 text-[#477A5B]" />
                {entry.regionalNames.sanskrit ? `Sanskrit: ${entry.regionalNames.sanskrit} • ` : ''}
                {entry.scientificName}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#202124] mb-2">
                {entry.commonName}
              </h1>

              <p className="text-sm font-medium text-[#477A5B] italic mb-4">
                Accepted Botanical Name: {entry.scientificName} ({entry.family})
              </p>

              <p className="text-base md:text-lg text-[#3C4043] leading-relaxed mb-6 max-w-3xl">
                {entry.overview}
              </p>

              {/* Regional Names Badge List */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#5F6368]">Regional Names:</span>
                {Object.entries(entry.regionalNames).map(([lang, name]) => (
                  <span
                    key={lang}
                    className="px-2.5 py-0.5 rounded-md bg-[#F8F9FA] border border-[#DADCE0] text-xs text-[#202124]"
                  >
                    <strong className="capitalize text-[#477A5B] font-semibold">{lang}:</strong> {name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/chat?context=${encodeURIComponent(`${entry.commonName} (${entry.scientificName})`)}#chat-input`}
                  className="px-5 py-3 rounded-xl bg-[#477A5B] hover:bg-[#396248] text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask IP-Sakti AI about {entry.commonName}
                </Link>
                {entry.informationSources[0] && (
                  <a
                    href={entry.informationSources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#E8F0E9] text-[#2D5A3F] font-semibold text-xs border border-[#DADCE0] transition-colors inline-flex items-center gap-2"
                  >
                    Reference Source ({entry.informationSources[0].name})
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Herb Image & Attribution Quickcard */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#DADCE0] overflow-hidden shadow-sm bg-[#F8F9FA] p-2">
                <div className="relative h-64 w-full rounded-xl overflow-hidden bg-white border border-[#DADCE0]">
                  <img
                    src={entry.image}
                    alt={`Botanical photograph of ${entry.scientificName} (${entry.commonName})`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-left space-y-1 text-[11px] text-[#5F6368]">
                  <div className="flex items-center gap-1 text-[#202124] font-semibold">
                    <ImageIcon className="w-3.5 h-3.5 text-[#477A5B]" />
                    Image Attribution Metadata
                  </div>
                  <div>Source: <span className="text-[#3C4043]">{entry.imageMetadata.source}</span></div>
                  <div>License: <span className="text-[#2D5A3F] font-medium">{entry.imageMetadata.license}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED SECTIONS */}
      <section className="py-12 bg-[#FFFFFF]">
        <div className="samhita-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-10">

              {/* 1. BOTANICAL INFORMATION */}
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#DADCE0] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#F3F7F3] border border-[#DADCE0] text-[#477A5B]">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#202124]">Botanical Information</h2>
                    <p className="text-xs text-[#5F6368]">Taxonomic classification & physical characteristics (POWO Kew & e-Charak)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#DADCE0]">
                    <span className="block text-xs font-semibold text-[#5F6368]">Accepted Scientific Name</span>
                    <span className="text-sm font-bold text-[#202124] italic">{entry.scientificName}</span>
                  </div>
                  <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#DADCE0]">
                    <span className="block text-xs font-semibold text-[#5F6368]">Plant Family</span>
                    <span className="text-sm font-bold text-[#202124]">{entry.family}</span>
                  </div>
                </div>

                {/* Synonyms */}
                {entry.synonyms.length > 0 && (
                  <div className="mb-6">
                    <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                      Botanical Synonyms & Historical References
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {entry.synonyms.map((syn, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs italic text-[#3C4043]">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parts Used */}
                <div className="mb-6">
                  <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                    Officially Referenced Plant Parts
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {entry.partsUsed.map((part, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#E8F0E9] border border-[#477A5B]/30 rounded-full text-xs font-semibold text-[#2D5A3F]">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                    Botanical Description
                  </span>
                  <p className="text-sm text-[#3C4043] leading-relaxed">
                    {entry.botanicalDescription}
                  </p>
                </div>
              </div>

              {/* 2. TRADITIONAL & AYURVEDIC CONTEXT */}
              <div className="p-8 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#DADCE0] text-[#477A5B]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#202124]">Traditional & Ayurvedic Context</h2>
                    <p className="text-xs text-[#5F6368]">Classical Ayurvedic properties & Samhita text citations</p>
                  </div>
                </div>

                {/* Ayurvedic Properties Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-[#FFFFFF] rounded-xl border border-[#DADCE0]">
                  <div>
                    <span className="block text-[11px] text-[#5F6368]">Rasa (Taste)</span>
                    <span className="text-xs font-semibold text-[#202124]">{entry.ayurvedicContext.rasa || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#5F6368]">Virya (Potency)</span>
                    <span className="text-xs font-semibold text-[#202124]">{entry.ayurvedicContext.virya || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#5F6368]">Vipaka</span>
                    <span className="text-xs font-semibold text-[#202124]">{entry.ayurvedicContext.vipaka || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#5F6368]">Dosha Action</span>
                    <span className="text-xs font-semibold text-[#2D5A3F]">{entry.ayurvedicContext.doshaEffect || 'N/A'}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                    Traditional Context Summary
                  </span>
                  <p className="text-sm text-[#3C4043] leading-relaxed">
                    {entry.traditionalContext}
                  </p>
                </div>

                {/* Samhita References */}
                {entry.classicalReferences.length > 0 && (
                  <div className="mb-6">
                    <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-3">
                      Classical Samhita Text Citations
                    </span>
                    <ul className="space-y-2">
                      {entry.classicalReferences.map((ref, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#3C4043]">
                          <CheckCircle className="w-4 h-4 text-[#477A5B] shrink-0 mt-0.5" />
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formulations */}
                {entry.relatedFormulations.length > 0 && (
                  <div>
                    <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                      Classical Formulations Containing {entry.commonName}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {entry.relatedFormulations.map((form, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#DADCE0] text-xs font-medium text-[#202124]">
                          {form}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. RESEARCH & REFERENCES */}
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#DADCE0] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#F3F7F3] border border-[#DADCE0] text-[#477A5B]">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#202124]">Research & References</h2>
                    <p className="text-xs text-[#5F6368]">Peer-reviewed pharmacological studies & NCBI records</p>
                  </div>
                </div>

                {entry.researchReferences.length === 0 ? (
                  <p className="text-sm text-[#5F6368] italic">
                    Research references are currently being curated for this entry.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {entry.researchReferences.map((paper, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] text-xs">
                        <h3 className="font-bold text-[#202124] text-sm mb-1">{paper.title}</h3>
                        <p className="text-[#5F6368] mb-2">
                          {paper.authors ? `${paper.authors} • ` : ''}{paper.journal ? `${paper.journal} ` : ''}{paper.year ? `(${paper.year})` : ''}
                        </p>
                        <p className="text-[#3C4043] leading-relaxed mb-3">{paper.summary}</p>
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#477A5B] hover:underline"
                        >
                          View NCBI Publication <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. INTELLECTUAL PROPERTY LANDSCAPE */}
              <div className="p-8 rounded-2xl bg-[#F3F7F3] border border-[#477A5B]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#DADCE0] text-[#477A5B]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#202124]">Intellectual Property Landscape</h2>
                    <p className="text-xs text-[#2D5A3F]">TKDL catalog status, prior art highlights, and Section 3(p) evaluation</p>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DADCE0] mb-4">
                  <span className="block text-xs font-bold text-[#202124] mb-1">Global Patent Status</span>
                  <p className="text-xs text-[#3C4043] leading-relaxed">{entry.ipInformation.patentStatus}</p>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DADCE0] mb-4">
                  <span className="block text-xs font-bold text-[#202124] mb-1">TKDL Catalog Status</span>
                  <p className="text-xs text-[#2D5A3F] font-medium">{entry.ipInformation.tkdlStatus}</p>
                </div>

                {entry.ipInformation.priorArtHighlights.length > 0 && (
                  <div className="mb-4">
                    <span className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                      Prior Art & Patent References
                    </span>
                    <ul className="space-y-1.5">
                      {entry.ipInformation.priorArtHighlights.map((pa, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#3C4043]">
                          <FileText className="w-3.5 h-3.5 text-[#477A5B] shrink-0 mt-0.5" />
                          <span>{pa}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DADCE0] text-xs text-[#5F6368]">
                  <span className="font-bold text-[#202124] block mb-1">Section 3(p) Indian Patent Act Guidance</span>
                  <p className="leading-relaxed">{entry.ipInformation.patentabilityNotes}</p>
                </div>
              </div>

              {/* 5. SOURCES & IMAGE ATTRIBUTION */}
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#DADCE0] shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#202124] mb-3">Sources & References</h2>
                  <div className="space-y-2">
                    {entry.informationSources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl border border-[#DADCE0] bg-[#F8F9FA] hover:border-[#477A5B] transition-colors flex items-center justify-between group text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#202124] group-hover:text-[#477A5B] transition-colors block">
                            {src.name}
                          </span>
                          <span className="text-[11px] text-[#5F6368] uppercase font-semibold">{src.type} source</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#5F6368] group-hover:text-[#477A5B]" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Detailed Image Licensing Metadata */}
                <div className="pt-4 border-t border-[#DADCE0] text-xs">
                  <h3 className="font-bold text-[#202124] mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#477A5B]" /> Image Attribution & License Metadata
                  </h3>
                  <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#DADCE0] space-y-1 text-[#5F6368]">
                    <div><strong>Image Source:</strong> {entry.imageMetadata.source}</div>
                    <div><strong>Creator / Collection:</strong> {entry.imageMetadata.creator}</div>
                    <div><strong>License:</strong> <span className="text-[#2D5A3F] font-semibold">{entry.imageMetadata.license}</span></div>
                    <div><strong>Attribution Note:</strong> {entry.imageMetadata.attribution}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* AI CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#F3F7F3] to-[#FFFFFF] border border-[#DADCE0] shadow-sm sticky top-28">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#477A5B] mb-2">
                  <Sparkles className="w-4 h-4" />
                  Ask IP-Sakti AI
                </div>
                <h3 className="font-bold text-[#202124] text-base mb-2">
                  Evaluate {entry.commonName} IP
                </h3>
                <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                  Ask our AI regarding prior art risk, Section 3(p) compliance, or formulation patentability for {entry.commonName}.
                </p>

                <Link
                  href={`/chat?context=${encodeURIComponent(`${entry.commonName} (${entry.scientificName})`)}#chat-input`}
                  className="w-full py-3 rounded-xl bg-[#477A5B] hover:bg-[#396248] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Start Contextual Chat
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Related Entries */}
              {relatedItems.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#DADCE0]">
                  <h3 className="font-bold text-[#202124] text-sm mb-4">Related Knowledge Entries</h3>
                  <div className="space-y-3">
                    {relatedItems.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/samhita/${item.slug}`}
                        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F9FA] transition-colors border border-transparent hover:border-[#DADCE0]"
                      >
                        <img
                          src={item.image}
                          alt={item.commonName}
                          className="w-12 h-12 rounded-lg object-cover border border-[#DADCE0]"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <span className="block font-bold text-[#202124] group-hover:text-[#477A5B] transition-colors truncate">
                            {item.commonName}
                          </span>
                          <span className="block text-[11px] text-[#5F6368] italic truncate">
                            {item.scientificName}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER DISCLAIMER */}
      <footer className="py-8 bg-[#FFFFFF] border-t border-[#DADCE0]">
        <div className="samhita-container text-center text-xs text-[#5F6368]">
          <p className="max-w-3xl mx-auto">
            <strong>Educational & IP Knowledge Disclaimer:</strong> Content provided for educational, research, and prior-art reference purposes. Consult qualified legal and healthcare professionals for binding advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
