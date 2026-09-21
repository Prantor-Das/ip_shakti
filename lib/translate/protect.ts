import manifest from '@/corpus/manifest.json';

const markerPattern = /\[S\d+\]/g;
const legalReferencePattern = /\b(?:Section|Article)\s+\d+(?:\([a-z0-9]+\))?/gi;
const citationLabels = manifest.map((item) => item.citationLabel);

function protectedPattern(): RegExp {
  const labels = citationLabels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(?:${labels.join('|')})`, 'g');
}

export interface ProtectedText {
  text: string;
  placeholders: Map<string, string>;
}

export function protect(text: string): ProtectedText {
  const placeholders = new Map<string, string>();
  let index = 0;
  const patterns = [markerPattern, legalReferencePattern, protectedPattern()];
  let protectedText = text;
  for (const pattern of patterns) {
    protectedText = protectedText.replace(pattern, (value) => {
      const token = `__IPSAKTI_KEEP_${index}__`;
      index += 1;
      placeholders.set(token, value);
      return token;
    });
  }
  return { text: protectedText, placeholders };
}

export function restore(text: string, placeholders: Map<string, string>): string | null {
  for (const token of placeholders.keys()) if (!text.includes(token)) return null;
  let restored = text;
  for (const [token, value] of placeholders) restored = restored.split(token).join(value);
  return restored;
}
