'use client';

import { CHECKOUT_FREE_DELIVERY_MIN } from '@/lib/checkout';

interface AnnouncementBarProps {
  freeDeliveryMin?: number;
}

export default function AnnouncementBar({
  freeDeliveryMin = CHECKOUT_FREE_DELIVERY_MIN,
}: AnnouncementBarProps) {
  const announcement = `FREE DELIVERY ON ORDERS ABOVE RS. ${freeDeliveryMin.toLocaleString('en-PK')} — TAINZY NATURALS — QUALITY WELLNESS FOR EVERYDAY HEALTH`;

  return (
    <div
      className="announcement-bar"
      role="region"
      aria-label="Promotional announcement"
    >
      <div className="marquee w-full">
        <div className="marquee-track">
          <span className="marquee-item">{announcement}</span>
          <span className="marquee-item" aria-hidden="true">
            {announcement}
          </span>
        </div>
      </div>
    </div>
  );
}
