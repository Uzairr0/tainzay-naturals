import { Tag } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface CartDiscountBannerProps {
  savings: number;
}

export default function CartDiscountBanner({ savings }: CartDiscountBannerProps) {
  if (savings <= 0) return null;

  return (
    <div className="cart-discount-banner" role="status">
      <div className="cart-discount-banner-label">
        <span className="cart-discount-banner-icon" aria-hidden="true">
          <Tag size={16} strokeWidth={2} />
        </span>
        <span>Discount applied to this order</span>
      </div>
      <span className="cart-discount-banner-amount">- {formatPrice(savings)}</span>
    </div>
  );
}
