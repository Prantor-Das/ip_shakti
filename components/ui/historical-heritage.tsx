'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Scroll, Stethoscope, Feather, Sparkles, Binary } from 'lucide-react';

export interface HeritageFigure {
  id: string;
  name: string;
  role: string;
  associatedWork: string;
  bio: string;
  label: string;
  imageUrl: string;
  knowledgePoints: string[];
  motif: 'medicine' | 'surgery' | 'integration' | 'diagnosis' | 'formulation' | 'materia';
}

const figures: HeritageFigure[] = [
  {
    id: 'charaka',
    name: 'CHARAKA',
    role: 'Physician & Classical Scholar',
    associatedWork: 'Charaka Samhita',
    bio: 'Charaka is closely associated with the Charaka Samhita, one of the foundational classical treatises of Ayurveda, with a major focus on internal medicine and Ayurvedic principles.',
    label: 'CLASSICAL MEDICINE',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUash6u9B2VSJa97Y1j6pCeR8_Ay9_ZZTJffdOusotQQ&s=10',
    knowledgePoints: [
      'Classical medical tradition',
      'Internal medicine & therapeutics',
      'Foundational Ayurvedic text tradition',
    ],
    motif: 'medicine',
  },
  {
    id: 'sushruta',
    name: 'SUSHRUTA',
    role: 'Physician & Surgical Scholar',
    associatedWork: 'Sushruta Samhita',
    bio: 'Sushruta is associated with the Sushruta Samhita, a major classical Ayurvedic treatise with extensive discussion of surgery and surgical knowledge.',
    label: 'SURGICAL TRADITION',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR88c3T-SU-IckBSuNWpykth5NWLM9Nh0aUflum2jWUhA&s=10',
    knowledgePoints: [
      'Surgical methodology & instruments',
      'Anatomical studies & procedure codification',
      'Pioneer of classical reconstructive techniques',
    ],
    motif: 'surgery',
  },
  {
    id: 'vagbhata',
    name: 'VAGBHATA',
    role: 'Classical Ayurvedic Scholar',
    associatedWork: 'Ashtanga Sangraha · Ashtanga Hridaya',
    bio: 'Vagbhata is associated with the Ashtanga Sangraha and Ashtanga Hridaya, works that bring together and organize major strands of earlier Ayurvedic knowledge.',
    label: 'INTEGRATION',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjJXEM3UpZ29vl3BAsyC3vtr0kPsHRbbYlyrv9RmIwqg&s=10',
    knowledgePoints: [
      'Synthesis of classical knowledge',
      'Ashtanga Hridaya & Sangraha treatises',
      'Comprehensive clinical codification',
    ],
    motif: 'integration',
  },
  {
    id: 'madhava',
    name: 'MADHAVA',
    role: 'Physician & Author',
    associatedWork: 'Madhava Nidana',
    bio: 'Madhava is associated with Madhava Nidana, a major classical work focused on the systematic description and diagnosis of diseases.',
    label: 'DIAGNOSTIC TRADITION',
    imageUrl: 'https://i.ytimg.com/vi/Mh_02Sm1rRE/sddefault.jpg',
    knowledgePoints: [
      'Systematic disease etiology',
      'Diagnostic methodology & classification',
      'Standardized pathology reference',
    ],
    motif: 'diagnosis',
  },
  {
    id: 'sharangdhara',
    name: 'SHARANGDHARA',
    role: 'Physician & Author',
    associatedWork: 'Sharngadhara Samhita',
    bio: 'Sharngadhara is associated with the Sharngadhara Samhita, a later Ayurvedic text known for its discussion of medicinal formulations and dosage forms.',
    label: 'FORMULATIONS',
    imageUrl: 'https://cdn.exoticindia.com/images/products/original/books-2016/haa824.webp',
    knowledgePoints: [
      'Pharmaceutical processing & compounding',
      'Dosage form classifications',
      'Classical formulation standards',
    ],
    motif: 'formulation',
  },
  {
    id: 'bhavamishra',
    name: 'BHAVAMISHRA',
    role: 'Physician & Scholar',
    associatedWork: 'Bhavaprakasha',
    bio: 'Bhavamishra is associated with Bhavaprakasha, an influential later Ayurvedic work containing extensive material on medicinal substances and their properties.',
    label: 'MATERIA MEDICA',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_1UsSIOtsDXvzxlxG_oKAXEvL9mkt3-q2aC4H9tmsYg&s=1',
    knowledgePoints: [
      'Comprehensive Materia Medica',
      'Plant & substance property mapping',
      'Classical pharmacological lexicon',
    ],
    motif: 'materia',
  },
];

/* Editorial Archive Image Frame component */
const ArchiveIllustration = ({
  name,
  imageUrl,
  motif,
}: {
  name: string;
  imageUrl: string;
  motif: HeritageFigure['motif'];
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F8F9FA] via-[#F3F7F3] to-[#E8F0E9] border border-[#DADCE0] shadow-sm group-hover:border-[#477A5B]/40 transition-all duration-300">
      {/* Decorative corner archive lines */}
      <div className="absolute top-4 left-4 z-20 w-4 h-4 border-t-2 border-l-2 border-[#477A5B]/60" />
      <div className="absolute top-4 right-4 z-20 w-4 h-4 border-t-2 border-r-2 border-[#477A5B]/60" />
      <div className="absolute bottom-4 left-4 z-20 w-4 h-4 border-b-2 border-l-2 border-[#477A5B]/60" />
      <div className="absolute bottom-4 right-4 z-20 w-4 h-4 border-b-2 border-r-2 border-[#477A5B]/60" />

      {!imgError ? (
        <img
          src={imageUrl}
          alt={`Historical portrait representation of ${name}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        /* Fallback icon representation */
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-[#2D5A3F] p-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFFFFF] border border-[#DADCE0] flex items-center justify-center mb-3 shadow-sm">
            {motif === 'medicine' && <Scroll className="w-10 h-10 text-[#477A5B]" />}
            {motif === 'surgery' && <Feather className="w-10 h-10 text-[#477A5B]" />}
            {motif === 'integration' && <BookOpen className="w-10 h-10 text-[#477A5B]" />}
            {motif === 'diagnosis' && <Stethoscope className="w-10 h-10 text-[#477A5B]" />}
            {motif === 'formulation' && <Sparkles className="w-10 h-10 text-[#477A5B]" />}
            {motif === 'materia' && <Binary className="w-10 h-10 text-[#477A5B]" />}
          </div>
          <span className="text-xs font-bold text-[#202124]">{name}</span>
        </div>
      )}
    </div>
  );
};

export function HistoricalHeritageSection() {
  return (
    <section className="w-full bg-[#FFFFFF] py-20 px-4 sm:px-6 lg:px-8 text-[#202124]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#477A5B] mb-3">
            THOSE WHO SHAPED THE TRADITION
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#202124] mb-4">
            Generations of Classical Scholars
          </h2>
          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed">
            From classical physicians to foundational texts, generations of scholars shaped the
            knowledge tradition that continues to inspire Ayurveda today.
          </p>
        </div>

        {/* Full-width Alternating Scholar Entries (No Cards) */}
        <div className="space-y-20">
          {figures.map((figure, index) => {
            const isEven = index % 2 === 0;

            return (
              <React.Fragment key={figure.id}>
                <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  {/* Image Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <ArchiveIllustration
                      name={figure.name}
                      imageUrl={figure.imageUrl}
                      motif={figure.motif}
                    />
                  </div>

                  {/* Information Column (Sitting directly on page, no card enclosure) */}
                  <div
                    className={`lg:col-span-7 flex flex-col justify-center ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {/* Small Category Label */}
                    <div className="mb-2">
                      <span className="text-xs font-bold tracking-widest text-[#477A5B] uppercase">
                        {figure.label}
                      </span>
                    </div>

                    {/* Large Scholar Name */}
                    <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#202124] mb-2 leading-none">
                      {figure.name}
                    </h3>

                    {/* Short Role */}
                    <p className="text-sm font-semibold text-[#5F6368] mb-2">
                      {figure.role}
                    </p>

                    {/* Associated Work */}
                    <div className="flex items-center gap-2 text-base font-bold text-[#202124] mb-4">
                      <BookOpen className="w-4 h-4 text-[#477A5B]" />
                      <span>{figure.associatedWork}</span>
                    </div>

                    {/* Biography */}
                    <p className="text-sm sm:text-base text-[#5F6368] leading-relaxed mb-5">
                      {figure.bio}
                    </p>

                    {/* Knowledge Points */}
                    <ul className="space-y-2 mb-6 text-xs sm:text-sm text-[#3C4043] font-medium">
                      {figure.knowledgePoints.map((point, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#477A5B]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Small Text Link */}
                    <div>
                      <Link
                        href="/samhita"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#477A5B] hover:text-[#2D5A3F] transition-all group-hover:translate-x-1"
                      >
                        <span>Explore in Samhita</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Thin Horizontal Divider (~85% width) between entries */}
                {index < figures.length - 1 && (
                  <div className="w-[85%] mx-auto my-16 border-b border-[#DADCE0]" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Section Ending CTA (Text-based, no card) */}
        <div className="mt-24 text-center pt-10 border-t border-[#DADCE0] flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-[#5F6368] text-base font-medium">
            Explore the knowledge behind the tradition →
          </span>
          <Link
            href="/samhita"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#477A5B] hover:bg-[#396248] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:gap-3"
          >
            <span>Explore Samhita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
