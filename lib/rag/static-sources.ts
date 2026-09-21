import type { Citation, Jurisdiction } from '@/lib/chat/types';

export interface StaticSource extends Citation {
  summary: string;
}

export const REFERENCE_BLOCK: StaticSource[] = [
  {
    id: 'S1',
    title: 'Patents Act 1970 — Section 3(p)',
    jurisdiction: 'india',
    ref: 'Patents Act 1970, Section 3(p)',
    summary:
      'Inventions which in effect are traditional knowledge or an aggregation or duplication of known properties of traditionally known component(s) are non-patentable in India.',
  },
  {
    id: 'S2',
    title: 'Traditional Knowledge Digital Library (TKDL)',
    jurisdiction: 'india',
    ref: 'TKDL official repository description',
    summary:
      'A digital repository of Indian traditional medicine formulations intended to prevent biopiracy and wrongful patent grants at global patent offices.',
  },
  {
    id: 'S3',
    title: 'Biological Diversity Act 2002 — Access & Benefit Sharing',
    jurisdiction: 'india',
    ref: 'Biological Diversity Act 2002, access and benefit-sharing provisions',
    summary:
      'Indian biological-resource access and benefit-sharing requirements apply to specified research and commercial utilisation contexts.',
  },
  {
    id: 'S4',
    title: 'Geographical Indications of Goods Act 1999',
    jurisdiction: 'india',
    ref: 'Geographical Indications of Goods Act 1999',
    summary:
      'Protects goods originating from a specific region where a quality, reputation, or characteristic is attributable to geographical origin.',
  },
  {
    id: 'S5',
    title: 'Nagoya Protocol on Access and Benefit-Sharing',
    jurisdiction: 'international',
    ref: 'Nagoya Protocol under the Convention on Biological Diversity',
    summary:
      'An international framework for fair and equitable benefit-sharing arising from the utilisation of genetic resources.',
  },
  {
    id: 'S6',
    title: 'WIPO Intergovernmental Committee',
    jurisdiction: 'international',
    ref: 'WIPO IGC on intellectual property, genetic resources, traditional knowledge and traditional cultural expressions',
    summary:
      'An international forum negotiating instruments concerning traditional knowledge, traditional cultural expressions, and genetic resources.',
  },
];

export function sourcesForJurisdiction(jurisdiction: Jurisdiction): StaticSource[] {
  return REFERENCE_BLOCK.filter((source) => source.jurisdiction === jurisdiction);
}
