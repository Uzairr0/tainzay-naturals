import Image from 'next/image';
import Link from 'next/link';
import { CONCERN_COLLAGE_IMAGE, HEALTH_CONCERNS } from '@/lib/concerns';

export default function ConcernSection() {
  return (
    <section className="section-padding bg-surface-gray">
      <div className="container-site">
        <div className="concern-panel">
          <div className="concern-image">
            <Image
              src={CONCERN_COLLAGE_IMAGE}
              alt="People supported by Tainzy Naturals wellness products"
              width={600}
              height={600}
              className="concern-image__img"
              sizes="(max-width: 1023px) 100vw, 42vw"
            />
          </div>

          <div className="concern-content">
            <h2 className="concern-title">
              Find the right products for your wellness goals
            </h2>
            <p className="concern-text">
              Select a concern to explore Tainzy Naturals solutions matched to your
              needs — from vitamins and immunity support to pain relief, digestive
              health, and cognitive wellbeing. We&apos;re here to help you make better
              choices for everyday health across Pakistan.
            </p>

            <div className="concern-tags">
              {HEALTH_CONCERNS.map((concern) => (
                <Link
                  key={concern.href}
                  href={concern.href}
                  className="pill-tag"
                >
                  {concern.label}
                </Link>
              ))}
            </div>

            <Link href="/know-your-concern" className="btn-primary-dark concern-cta">
              Know Your Concern
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
