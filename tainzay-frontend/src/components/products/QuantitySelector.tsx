'use client';

import { Minus, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

export default function QuantitySelector({
  value,
  onChange,
  disabled = false,
  label = 'Quantity',
  id = 'product-quantity',
}: QuantitySelectorProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const displayValue = draft ?? String(value);

  const commit = useCallback(
    (next: number) => {
      const clamped = clampQuantity(next);
      setDraft(null);
      onChange(clamped);
    },
    [onChange],
  );

  return (
    <div className="pdp-qty">
      <label htmlFor={id} className="pdp-qty-label">
        {label}:
      </label>
      <div className="pdp-qty-control">
        <button
          type="button"
          className="pdp-qty-btn"
          onClick={() => commit(value - 1)}
          disabled={disabled || value <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} aria-hidden="true" />
        </button>

        <input
          id={id}
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          className="pdp-qty-input"
          value={displayValue}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            if (draft === null) return;
            commit(Number(draft));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit(Number(draft ?? value));
            }
          }}
          aria-label="Product quantity"
        />

        <button
          type="button"
          className="pdp-qty-btn"
          onClick={() => commit(value + 1)}
          disabled={disabled}
          aria-label="Increase quantity"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
