'use client';

import { useState } from 'react';
import { getProductHighlightContent } from '@/lib/product-highlights';
import type { Product } from '@/types';

interface ProductBenefitsSectionProps {
  product: Product;
}

export default function ProductBenefitsSection({ product }: ProductBenefitsSectionProps) {
  const { benefits, packSizeLine, sizeOptions } = getProductHighlightContent(product);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? 'Standard');

  return (
    <section className="pdp-highlights" aria-label="Product benefits and pack size">
      <h2 className="pdp-highlights-title">
        Top benefits of {product.name}:
      </h2>

      <ul className="pdp-highlights-list">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>

      <p className="pdp-highlights-pack-line">{packSizeLine}</p>

      <div className="pdp-highlights-size-options" role="list" aria-label="Available sizes">
        {sizeOptions.map((option) => {
          const isSelected = option === selectedSize;

          return (
            <button
              key={option}
              type="button"
              role="listitem"
              className={`pdp-highlights-size-option${isSelected ? ' is-selected' : ''}`}
              aria-pressed={isSelected}
              onClick={() => setSelectedSize(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
