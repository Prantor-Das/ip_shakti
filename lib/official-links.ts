export interface OfficialLink {
  id: string;
  name: string;
  description: string;
  url: string;
}

// URLs verified on 2026-09-21. Some public search portals return 403 to automated clients
// while remaining valid browser destinations.
export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: 'tkdl',
    name: 'TKDL',
    description: 'Traditional Knowledge Digital Library',
    url: 'https://tkdl.res.in/',
  },
  {
    id: 'nba',
    name: 'NBA',
    description: 'National Biodiversity Authority',
    url: 'https://nbaindia.org/',
  },
  {
    id: 'ipindia',
    name: 'IPIndia',
    description: 'Intellectual Property India',
    url: 'https://ipindia.gov.in/',
  },
  {
    id: 'indiacode',
    name: 'India Code',
    description: 'Digital repository of Indian legislation',
    url: 'https://www.indiacode.nic.in/',
  },
  {
    id: 'wipo-lex',
    name: 'WIPO Lex',
    description: 'Global IP law database',
    url: 'https://www.wipo.int/wipolex/en/',
  },
  {
    id: 'patentscope',
    name: 'WIPO PATENTSCOPE',
    description: 'International patent search portal',
    url: 'https://patentscope.wipo.int/',
  },
  {
    id: 'espacenet',
    name: 'Espacenet',
    description: 'European Patent Office patent search',
    url: 'https://worldwide.espacenet.com/',
  },
  {
    id: 'absch',
    name: 'CBD ABS Clearing-House',
    description: 'Access and benefit-sharing information portal',
    url: 'https://absch.cbd.int/',
  },
];
