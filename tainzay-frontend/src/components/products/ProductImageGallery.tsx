'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { imageLoaderFor } from '@/lib/cloudinary';

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
  productName: string;
  saleBadge?: string;
}

export default function ProductImageGallery({
  mainImage,
  images = [],
  productName,
  saleBadge,
}: ProductImageGalleryProps) {
  // Build the full list: main image first, then extras (deduplicated)
  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const activeSrc = imgError[activeIndex]
    ? '/products/placeholder.svg'
    : (allImages[activeIndex] ?? '/products/placeholder.svg');

  function handleThumbClick(index: number) {
    setActiveIndex(index);
    setZoomed(false);
  }

  return (
    <div className="pdp-gallery">
      {/* ── Main image ── */}
      <div
        className={`pdp-gallery-main${zoomed ? ' is-zoomed' : ''}`}
        onClick={() => allImages.length > 0 && setZoomed((z) => !z)}
        role="button"
        tabIndex={0}
        aria-label={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
        onKeyDown={(e) => e.key === 'Enter' && setZoomed((z) => !z)}
      >
        {saleBadge && <span className="pdp-gallery-sale-badge">{saleBadge}</span>}

        <Image
          src={activeSrc}
          alt={productName}
          fill
          priority
          loader={imageLoaderFor(activeSrc, 'pdp')}
          className="pdp-gallery-img"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 480px"
          onError={() => setImgError((prev) => ({ ...prev, [activeIndex]: true }))}
        />
        {!zoomed && (
          <span className="pdp-gallery-zoom-hint" aria-hidden="true">
            <ZoomIn size={18} />
          </span>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {allImages.length > 1 && (
        <div className="pdp-gallery-thumbs" role="list">
          {allImages.map((src, index) => {
            const thumbSrc = imgError[index] ? '/products/placeholder.svg' : src;
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                role="listitem"
                className={`pdp-gallery-thumb${isActive ? ' is-active' : ''}`}
                onClick={() => handleThumbClick(index)}
                aria-label={`View image ${index + 1} of ${allImages.length}`}
                aria-pressed={isActive}
              >
                <Image
                  src={thumbSrc}
                  alt={`${productName} – image ${index + 1}`}
                  fill
                  loader={imageLoaderFor(thumbSrc, 'pdp')}
                  className="object-contain p-1"
                  sizes="80px"
                  onError={() => setImgError((prev) => ({ ...prev, [index]: true }))}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
