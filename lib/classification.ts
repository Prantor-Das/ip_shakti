import type { FormulationType } from '@/lib/chat/types';

export type ClassificationAnswer = 'yes' | 'no' | 'unsure';
export interface ClassificationQuestion {
  id: number;
  text: string;
}
export interface ClassificationResult {
  type: FormulationType;
  note: string;
}

export const CLASSIFICATION_QUESTIONS: ClassificationQuestion[] = [
  {
    id: 1,
    text: 'Primarily a food/nutrition product with no disease-treatment or prevention claims?',
  },
  {
    id: 2,
    text: 'Applied externally to cleanse/beautify/alter appearance with no therapeutic claim?',
  },
  {
    id: 3,
    text: 'Formulation (ingredients, ratio, method, indication) taken as-is from a First-Schedule authoritative text?',
  },
  {
    id: 4,
    text: 'ALL ingredients found in First-Schedule texts, with only combination/ratio/dose/form modified?',
  },
  {
    id: 5,
    text: 'A purified, standardised fraction/extract of a medicinal plant defined by phytochemical markers (not a whole-herb preparation, not a single isolated compound)?',
  },
];

export function classifyFormulation(
  answers: Partial<Record<number, ClassificationAnswer>>
): ClassificationResult | null {
  for (const question of CLASSIFICATION_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) return null;
    if (answer === 'unsure')
      return { type: 'unsure', note: 'Not sure — consult a qualified regulatory professional.' };
    if (question.id === 1 && answer === 'yes')
      return { type: 'nutraceutical', note: 'Classified as nutraceutical (Ayurveda Aahar).' };
    if (question.id === 2 && answer === 'yes')
      return { type: 'cosmetic', note: 'Classified as cosmetic.' };
    if (question.id === 3 && answer === 'yes')
      return { type: 'classical', note: 'Classified as classical.' };
    if (question.id === 4 && answer === 'yes')
      return { type: 'proprietary', note: 'Classified as proprietary.' };
    if (question.id === 5)
      return {
        type: answer === 'yes' ? 'phytopharmaceutical' : 'new-drug',
        note: answer === 'yes' ? 'Classified as phytopharmaceutical.' : 'Classified as new-drug.',
      };
  }
  return null;
}
