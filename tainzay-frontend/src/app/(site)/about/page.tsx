import AboutCtaSection from '@/components/about/AboutCtaSection';
import AboutIntroSection from '@/components/about/AboutIntroSection';
import AboutPageHero from '@/components/about/AboutPageHero';
import AboutPillarsSection from '@/components/about/AboutPillarsSection';
import AboutProductFormsSection from '@/components/about/AboutProductFormsSection';
import AboutPromiseSection from '@/components/about/AboutPromiseSection';
import AboutStorySection from '@/components/about/AboutStorySection';
import AboutStructuredData from '@/components/about/AboutStructuredData';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ABOUT_PAGE } from '@/lib/about-content';
import { buildAboutMetadata } from '@/lib/about-seo';

export const metadata = buildAboutMetadata();

export default function AboutPage() {
  return (
    <>
      <AboutStructuredData />

      <div className="about-page">
        <AboutPageHero />

        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: ABOUT_PAGE.breadcrumb },
            ]}
          />
        </div>

        <main className="about-main" aria-label="About Tainzay">
          <div className="container-wide">
            <AboutIntroSection />
          </div>

          <AboutPromiseSection />
          <AboutPillarsSection />
          <AboutStorySection />
          <AboutProductFormsSection />
          <AboutCtaSection />
        </main>
      </div>
    </>
  );
}
