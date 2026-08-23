'use client';

import { Minus, Plus } from 'lucide-react';

interface CartQuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  slug: string;
}

function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

export default function CartQuantityControl({
  value,
  onChange,
  disabled = false,
  slug,
}: CartQuantityControlProps) {
  return (
    <div className="cart-qty" role="group" aria-label={`Quantity for ${slug}`}>
      <button
        type="button"
        className="cart-qty-btn"
        onClick={() => onChange(clampQuantity(value - 1))}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span className="cart-qty-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="cart-qty-btn"
        onClick={() => onChange(clampQuantity(value + 1))}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
