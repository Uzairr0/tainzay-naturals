export interface HealthConcern {
  label: string;
  href: string;
  concernId: string;
}

export const CONCERN_COLLAGE_IMAGE =
  'https://res.cloudinary.com/tainzay/image/upload/v1787125010/Mix_People_600x600_jpg.webp';

/** Home page concern tags — only concerns our products address */
export const HEALTH_CONCERNS: HealthConcern[] = [
  { label: 'Pain Relief', href: '/know-your-concern?concern=muscle-pain', concernId: 'muscle-pain' },
  { label: 'Cold & Flu', href: '/know-your-concern?concern=cough-cold', concernId: 'cough-cold' },
  { label: 'Respiratory', href: '/know-your-concern?concern=nasal-congestion', concernId: 'nasal-congestion' },
  { label: 'Digestive', href: '/know-your-concern?concern=acidity', concernId: 'acidity' },
  { label: 'Brain & Focus', href: '/know-your-concern?concern=brain-function', concernId: 'brain-function' },
  { label: 'Weak Immunity', href: '/know-your-concern?concern=weak-immunity', concernId: 'weak-immunity' },
  { label: 'Energy Boost', href: '/know-your-concern?concern=energy-boost', concernId: 'energy-boost' },
  { label: 'Vitamins', href: '/know-your-concern?concern=vitamin-deficiency', concernId: 'vitamin-deficiency' },
  { label: 'Weak Bones', href: '/know-your-concern?concern=weak-bones', concernId: 'weak-bones' },
  { label: 'Vitamin B12', href: '/know-your-concern?concern=b12-deficiency', concernId: 'b12-deficiency' },
  { label: 'Nerve Health', href: '/know-your-concern?concern=nerve-health', concernId: 'nerve-health' },
  { label: 'Daily Wellness', href: '/know-your-concern?concern=daily-wellness', concernId: 'daily-wellness' },
];
