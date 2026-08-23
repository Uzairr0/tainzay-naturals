'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { HERO_AUTOPLAY_MS, HERO_SLIDES } from '@/lib/hero-slides';
import { usePrefersReducedMotion, useSwipe } from '@/hooks/useCarousel';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const total = HERO_SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || total <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, HERO_AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, total]);

  return (
    <section className="hero-section" aria-label="Promotional banners">
      <div
        className="hero-carousel"
        aria-roledescription="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsPaused(false);
          }
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="hero-viewport">
          <div
            className="hero-track motion-safe"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {HERO_SLIDES.map((slide, index) => {
              const slideContent = (
                <div className="hero-slide-media">
                  <picture className="hero-slide-picture">
                    <source media="(min-width: 640px)" srcSet={slide.image} />
                    <img
                      src={slide.mobileImage ?? slide.image}
                      alt={slide.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding="async"
                      className="hero-slide-img"
                    />
                  </picture>
                </div>
              );

              return (
                <div key={slide.id} className="hero-slide" aria-hidden={index !== current}>
                  {slide.href ? (
                    <Link
                      href={slide.href}
                      aria-label={slide.alt}
                      tabIndex={index === current ? 0 : -1}
                      className="block h-full"
                    >
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Slide {current + 1} of {total}: {HERO_SLIDES[current]?.alt}
        </p>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="hero-carousel-arrow hero-arrow-prev"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="hero-carousel-arrow hero-arrow-next"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>

            <div className="hero-carousel-dots" role="tablist" aria-label="Slide navigation">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={index === current}
                  onClick={() => goTo(index)}
                  className={`hero-carousel-dot ${index === current ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
