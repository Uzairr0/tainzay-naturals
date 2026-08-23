import Image from 'next/image';
import { cloudinaryLoader } from '@/lib/cloudinary';

const CERTIFICATIONS_SRC =
  'https://res.cloudinary.com/tainzay/image/upload/v1787046088/image-removebg-preview.png';

export default function ProductTrustBadges() {
  return (
    <div className="pdp-trust" aria-label="Quality and regulatory certifications">
      <Image
        src={CERTIFICATIONS_SRC}
        alt="Brand of the Year, DRAP Registered, Halal Certified, ISO 9001, HACCP, U.S. FDA Registered, and GMP Certified"
        width={1200}
        height={120}
        loader={cloudinaryLoader}
        className="pdp-trust-strip"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 480px"
      />
    </div>
  );
}
