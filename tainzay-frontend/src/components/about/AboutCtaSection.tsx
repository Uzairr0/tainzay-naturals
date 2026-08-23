import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { ABOUT_PAGE } from '@/lib/about-content';
import { getWhatsAppUrl } from '@/lib/site-config';

export default function AboutCtaSection() {
  const { cta } = ABOUT_PAGE;
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section className="about-cta section-padding" aria-labelledby="about-cta-title">
      <div className="container-wide">
        <div className="about-cta-panel">
          <h2 id="about-cta-title" className="about-cta-title">
            {cta.title}
          </h2>
          <p className="about-cta-subtitle">{cta.subtitle}</p>

          <div className="about-cta-actions">
            <Link href={cta.primary.href} className="btn-primary-dark about-cta-btn">
              {cta.primary.label}
            </Link>
            <Link href={cta.secondary.href} className="about-cta-btn about-cta-btn-outline">
              {cta.secondary.label}
            </Link>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta-whatsapp"
          >
            <WhatsAppIcon className="about-cta-whatsapp-icon" />
            <span>{cta.whatsappLabel}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
