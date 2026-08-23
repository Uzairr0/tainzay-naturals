import SiteShell from '@/components/layout/SiteShell';

export const revalidate = 60;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
