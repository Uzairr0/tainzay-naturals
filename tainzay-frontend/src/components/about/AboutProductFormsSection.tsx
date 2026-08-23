import Link from 'next/link';
import {
  CircleDot,
  Droplets,
  FlaskConical,
  Pipette,
  Pill,
  type LucideIcon,
} from 'lucide-react';
import { ABOUT_PAGE, type AboutProductFormIcon } from '@/lib/about-content';

const FORM_ICONS: Record<AboutProductFormIcon, LucideIcon> = {
  tablets: Pill,
  capsules: CircleDot,
  syrups: FlaskConical,
  gels: Droplets,
  drops: Pipette,
};

export default function AboutProductFormsSection() {
  const { productForms } = ABOUT_PAGE;

  return (
    <section
      className="about-forms section-padding"
      aria-labelledby="about-forms-title"
    >
      <div className="container-wide">
        <div className="about-forms-head">
          <h2 id="about-forms-title" className="about-forms-title">
            {productForms.title}
          </h2>
          <p className="about-forms-subtitle">{productForms.subtitle}</p>
        </div>

        <ul className="about-forms-grid">
          {productForms.items.map((form) => {
            const Icon = FORM_ICONS[form.icon];

            return (
              <li key={form.label} className="about-form-card">
                <div className="about-form-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="about-form-label">{form.label}</h3>
                <p className="about-form-text">{form.description}</p>
              </li>
            );
          })}
        </ul>

        <div className="about-forms-action">
          <Link href={productForms.cta.href} className="btn-primary-dark">
            {productForms.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
