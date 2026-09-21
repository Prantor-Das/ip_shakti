import { SAMHITA_ENTRIES } from '@/lib/samhita-data';

export interface SamhitaContextTopic {
  slug: string;
  commonName: string;
  scientificName: string;
}

export function getSamhitaContextTopic(slug: string | undefined): SamhitaContextTopic | undefined {
  if (!slug) return undefined;
  const entry = SAMHITA_ENTRIES.find((item) => item.slug === slug);
  return entry
    ? { slug: entry.slug, commonName: entry.commonName, scientificName: entry.scientificName }
    : undefined;
}

export function samhitaContextText(topic: SamhitaContextTopic): string {
  return `The user selected the Samhita topic "${topic.commonName}" (${topic.scientificName}). Use this only as topic context; factual and legal claims still require retrieved sources.`;
}
