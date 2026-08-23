export const CONCERN_FINDER_AGE_RANGES = ['18-25', '26-35', '38-50', '55+'] as const;
export const CONCERN_FINDER_GENDERS = ['Male', 'Female'] as const;

export type ConcernFinderAge = (typeof CONCERN_FINDER_AGE_RANGES)[number];
export type ConcernFinderGender = (typeof CONCERN_FINDER_GENDERS)[number];

export interface PrimaryConcern {
  id: string;
  label: string;
  productSlug: string;
}

/** Only concerns Tainzay products can address */
export const PRIMARY_CONCERNS: PrimaryConcern[] = [
  { id: 'cough-cold', label: 'Cough & Cold', productSlug: 'kof-mark-syrup' },
  { id: 'nasal-congestion', label: 'Nasal Congestion', productSlug: 't-nase-drops' },
  { id: 'acidity', label: 'Acidity & Heartburn', productSlug: 'tancid-syrup' },
  { id: 'digestive-discomfort', label: 'Digestive Discomfort', productSlug: 'tancid-syrup' },
  { id: 'muscle-pain', label: 'Muscle & Joint Pain', productSlug: 'painset-gel' },
  { id: 'joint-pain', label: 'Joint Pain', productSlug: 'painset-gel' },
  { id: 'brain-function', label: 'Brain Function', productSlug: 'medigin-syrup' },
  { id: 'memory-focus', label: 'Memory & Focus', productSlug: 'murex-tablets' },
  { id: 'weak-immunity', label: 'Weak Immunity', productSlug: 'vitowell-tablets' },
  { id: 'energy-boost', label: 'Energy Boost', productSlug: 'vitowell-tablets' },
  { id: 'vitamin-deficiency', label: 'Vitamin Deficiency', productSlug: 'medical-tablets' },
  { id: 'weak-bones', label: 'Weak Bones', productSlug: 'mg-vit-d-tablets' },
  { id: 'vitamin-d', label: 'Vitamin D Deficiency', productSlug: 'kd-3-capsules' },
  { id: 'b12-deficiency', label: 'Vitamin B12 Deficiency', productSlug: 'tanicob-tablets' },
  { id: 'nerve-health', label: 'Nerve Health & Numbness', productSlug: 'xalmeth-tablets' },
  { id: 'daily-wellness', label: 'Daily Wellness', productSlug: 'vitowell-tablets' },
];

export function getConcernById(id: string): PrimaryConcern | undefined {
  return PRIMARY_CONCERNS.find((concern) => concern.id === id);
}

export function getRecommendedProductSlug(
  concernId: string,
  age: ConcernFinderAge,
  gender: ConcernFinderGender,
): string {
  const concern = getConcernById(concernId);
  if (!concern) return 'vitowell-tablets';

  switch (concernId) {
    case 'energy-boost':
      return gender === 'Male' ? 'mullet-tablets' : 'vitowell-tablets';
    case 'brain-function':
      return age === '55+' ? 'murex-tablets' : 'medigin-syrup';
    case 'memory-focus':
      return age === '55+' || gender === 'Male' ? 'murex-tablets' : 'murex-syrup';
    case 'weak-bones':
      return age === '55+' ? 'kd-3-capsules' : 'mg-vit-d-tablets';
    case 'vitamin-deficiency':
      return age === '55+' ? 'medical-tablets' : 'vitowell-tablets';
    case 'daily-wellness':
      return gender === 'Male' ? 'mullet-syrup' : 'vitowell-tablets';
    case 'weak-immunity':
      return age === '55+' ? 'medplexin-syrup' : 'vitowell-tablets';
    default:
      return concern.productSlug;
  }
}

export function getConcernFinderStep(
  age: ConcernFinderAge | null,
  gender: ConcernFinderGender | null,
  concernId: string | null,
): number {
  if (!age) return 1;
  if (!gender) return 2;
  if (!concernId) return 3;
  return 3;
}

export function getConcernFinderStepLabel(
  age: ConcernFinderAge | null,
  gender: ConcernFinderGender | null,
  concernId: string | null,
): string {
  if (age && gender && concernId) return 'Ready to Calculate!';
  return `Step ${getConcernFinderStep(age, gender, concernId)} of 3`;
}
