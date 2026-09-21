'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
  badge?: string;
}

interface Feature197Props {
  features?: FeatureItem[];
}

export const defaultIPFeatures: FeatureItem[] = [
  {
    id: 1,
    title: '1. AI Assistant',
    image: '/ai-assistant.jpg',
    description:
      'The central conversational interface of IP-SAKTI. Users can ask questions about Ayurvedic innovations, intellectual property, patents, regulations, traditional knowledge, and related topics in natural language.',
  },
  {
    id: 2,
    title: '2. RAG Knowledge Retrieval',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop',
    description:
      'Retrieves relevant information from curated IP, regulatory, Ayurveda, and traditional-knowledge sources before generating an answer, keeping responses grounded in available evidence.',
  },
  {
    id: 3,
    title: '3. Documentation Assist',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGF8ZbWiUnJIspTg8Ha-cg5orNaYgWGSPtupcotkWqZw&s=10',
    description:
      'Helps users understand documentation requirements, organize relevant information, and identify missing documents for IP and regulatory filing processes.',
  },
  {
    id: 4,
    title: '4. IP Protection',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop',
    description:
      'Provides guidance on relevant intellectual-property protection pathways for Ayurvedic innovations, including patents, trademarks, geographical indications, designs, copyright, and trade secrets.',
  },
  {
    id: 5,
    title: '5. Regulatory Intelligence',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    description:
      'Helps users understand applicable Ayurvedic and regulatory requirements and surfaces relevant regulatory information and compliance standards from authoritative sources.',
  },
  {
    id: 6,
    title: '6. Traditional Knowledge & Prior-Art',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop',
    description:
      'Helps users explore existing traditional Ayurvedic knowledge and prior-art information relevant to an innovation, supporting novelty and TKDL prior-art assessment.',
  },
  {
    id: 7,
    title: '7. Source-Cited Intelligence',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
    description:
      'Provides answers supported by identifiable sources, citations, and official references, allowing users to trace important information back to underlying legal and classical knowledge.',
  },
  {
    id: 8,
    title: '8. Market Intelligence',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    description:
      'Provides insights into relevant IP and market landscapes surrounding Ayurvedic innovations, helping users understand existing technologies, trends, and competitive areas.',
  },
  {
    id: 9,
    title: '9. Samhita Knowledge Repository',
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=1000&auto=format&fit=crop',
    description:
      'A dedicated Ayurveda knowledge repository where users can explore medicinal herbs, plants, formulations, classical knowledge, Ayurveda history, research, and relevant IP information.',
  },
  {
    id: 10,
    title: '10. Multilingual & Jurisdiction Intelligence',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop',
    description:
      'Helps users access IP and regulatory guidance across supported languages while distinguishing between Indian and international jurisdictions, reducing the risk of mixing legal frameworks.',
  },
];

export const Feature197 = ({ features = defaultIPFeatures }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [lastSelectedImage, setLastSelectedImage] = useState<string>(features[0]?.image || '');

  const activeFeature = features.find((f) => f.id === activeTabId) || (activeTabId === null ? null : features[0]);
  const displayImage = activeFeature?.image || lastSelectedImage;

  return (
    <section className="py-12 md:py-20 text-[#000000] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          {/* Accordion List */}
          <div className="w-full lg:w-1/2">
            <Accordion
              type="single"
              collapsible={true}
              className="w-full space-y-3"
              value={activeTabId ? `item-${activeTabId}` : ''}
              onValueChange={(val) => {
                if (val) {
                  const idNum = parseInt(val.replace('item-', ''), 10);
                  const selected = features.find((f) => f.id === idNum);
                  if (selected) {
                    setActiveTabId(selected.id);
                    setLastSelectedImage(selected.image);
                  }
                } else {
                  setActiveTabId(null);
                }
              }}
            >
              {features.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <AccordionItem
                    key={tab.id}
                    value={`item-${tab.id}`}
                    className={`rounded-2xl border transition-all px-5 py-1 ${isActive
                        ? 'bg-[#F3F7F3] border-[#2F855A] shadow-sm'
                        : 'bg-white border-[#DADCE0] hover:border-[#9AA0A6]'
                      }`}
                  >
                    <AccordionTrigger className="cursor-pointer py-4 !no-underline hover:no-underline flex items-center justify-between gap-3 text-left">
                      <h3
                        className="text-base sm:text-lg font-medium text-[#000000]"
                      >
                        {tab.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-[#3C4043] text-sm sm:text-base leading-relaxed pt-1 pb-2">
                        {tab.description}
                      </p>
                      {/* Mobile Image Preview */}
                      <div className="mt-4 lg:hidden rounded-2xl overflow-hidden border border-[#DADCE0] bg-[#F8F9FA]">
                        <img
                          src={tab.image}
                          alt={tab.title}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Desktop Preview Card (Sticky Side Graphic) */}
          <div className="hidden lg:block w-1/2 sticky top-28">
            <div className="relative overflow-hidden rounded-3xl bg-[#F8F9FA] border border-[#DADCE0] p-4 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white border border-[#DADCE0]">
                <img
                  src={displayImage}
                  alt={activeFeature?.title || 'Feature preview'}
                  className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
