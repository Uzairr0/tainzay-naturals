import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/site-config';

export default function HomeCtaSection() {
  const whatsappUrl = getWhatsAppUrl(
    undefined,
    'Hello, I would like help choosing a Tainzy Naturals product.',
  );

  return (
    <section className="home-cta section-padding" aria-labelledby="home-cta-title">
      <div className="container-site">
        <div className="home-cta-panel">
          <h2 id="home-cta-title" className="home-cta-title">
            Start your wellness journey today
          </h2>
          <p className="home-cta-subtitle">
            Not sure where to begin? Find products matched to your concern, or explore our full
            range of vitamins, supplements, and everyday wellness solutions.
          </p>

          <div className="home-cta-actions">
            <Link href="/know-your-concern" className="btn-primary-dark home-cta-btn">
              Know Your Concern
            </Link>
            <Link href="/products" className="home-cta-btn home-cta-btn-outline">
              Shop All Products
            </Link>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-cta-whatsapp"
          >
            <WhatsAppIcon className="home-cta-whatsapp-icon" />
            <span>Need help? Chat with us on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
