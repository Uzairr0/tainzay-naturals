import {
  BadgeCheck,
  LayoutGrid,
  PackageCheck,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import { ABOUT_PAGE, type AboutPillarIcon } from '@/lib/about-content';

const PILLAR_ICONS: Record<AboutPillarIcon, LucideIcon> = {
  quality: BadgeCheck,
  pricing: Tags,
  range: LayoutGrid,
  supply: PackageCheck,
};

export default function AboutPillarsSection() {
  const { pillars } = ABOUT_PAGE;

  return (
    <section className="about-pillars section-padding" aria-labelledby="about-pillars-title">
      <div className="container-wide">
        <div className="about-pillars-head">
          <h2 id="about-pillars-title" className="about-pillars-title">
            {pillars.title}
          </h2>
          <p className="about-pillars-subtitle">{pillars.subtitle}</p>
        </div>

        <ul className="about-pillars-grid">
          {pillars.items.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.icon];

            return (
              <li key={pillar.title} className="about-pillar-card">
                <div className="about-pillar-icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <h3 className="about-pillar-title">{pillar.title}</h3>
                <p className="about-pillar-text">{pillar.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
