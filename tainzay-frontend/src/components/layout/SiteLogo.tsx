import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site-config';

type SiteLogoVariant = 'default' | 'compact' | 'sticky' | 'footer';

interface SiteLogoProps {
  variant?: SiteLogoVariant;
  className?: string;
}

export default function SiteLogo({ variant = 'default', className = '' }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={`site-logo site-logo--${variant}${className ? ` ${className}` : ''}`}
      aria-label={`${SITE.name} home`}
    >
      <Image
        src={SITE.logoUrl}
        alt={SITE.name}
        width={240}
        height={72}
        priority={variant !== 'footer'}
        className="site-logo__img"
      />
    </Link>
  );
}
