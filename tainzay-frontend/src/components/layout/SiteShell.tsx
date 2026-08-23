import { Suspense } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppCTA from '@/components/layout/WhatsAppCTA';
import { fetchFeaturedProducts, fetchNavMenuData } from '@/lib/catalogue';
import { fetchPublicSiteSettings } from '@/lib/site-settings';

interface SiteShellProps {
  children: React.ReactNode;
}

export default async function SiteShell({ children }: SiteShellProps) {
  const [{ data: menuCategories }, { data: headerProducts }, { data: siteSettings }] =
    await Promise.all([
      fetchNavMenuData(),
      fetchFeaturedProducts(8),
      fetchPublicSiteSettings(),
    ]);

  return (
    <>
      <AnnouncementBar freeDeliveryMin={siteSettings.freeDeliveryMin} />
      <Suspense
        fallback={
          <div
            className="h-14 lg:h-[120px] bg-surface-white border-b border-border-light"
            aria-hidden="true"
          />
        }
      >
        <Header menuCategories={menuCategories} bestSellingProducts={headerProducts} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer
        contact={{
          phoneDisplay: siteSettings.phoneDisplay,
          phoneTel: siteSettings.phoneTel,
          supportEmail: siteSettings.supportEmail,
        }}
      />
      <WhatsAppCTA
        phoneNumber={siteSettings.whatsappPhone}
        message={siteSettings.whatsappMessage}
      />
    </>
  );
}
