'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { imageLoaderFor } from '@/lib/cloudinary';
import {
  CONCERN_FINDER_AGE_RANGES,
  CONCERN_FINDER_GENDERS,
  getConcernById,
  getConcernFinderStepLabel,
  getRecommendedProductSlug,
  PRIMARY_CONCERNS,
  type ConcernFinderAge,
  type ConcernFinderGender,
} from '@/lib/concern-finder';
import { formatPrice } from '@/lib/format';
import { getProductPricing } from '@/lib/product-pricing';
import type { Product } from '@/types';

interface ConcernFinderExperienceProps {
  productsBySlug: Record<string, Product>;
}

function isValidAge(value: string | null): value is ConcernFinderAge {
  return CONCERN_FINDER_AGE_RANGES.includes(value as ConcernFinderAge);
}

function isValidGender(value: string | null): value is ConcernFinderGender {
  return CONCERN_FINDER_GENDERS.includes(value as ConcernFinderGender);
}

function buildCartHref(slug: string): string {
  return `/cart?${new URLSearchParams({ add: slug, qty: '1' }).toString()}`;
}

export default function ConcernFinderExperience({ productsBySlug }: ConcernFinderExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);

  const initialConcern = searchParams.get('concern');
  const validInitialConcern =
    initialConcern && getConcernById(initialConcern) ? initialConcern : null;

  const [age, setAge] = useState<ConcernFinderAge | null>(null);
  const [gender, setGender] = useState<ConcernFinderGender | null>(null);
  const [concernId, setConcernId] = useState<string | null>(validInitialConcern);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (validInitialConcern) {
      setConcernId(validInitialConcern);
    }
  }, [validInitialConcern]);

  const stepLabel = getConcernFinderStepLabel(age, gender, concernId);
  const isComplete = Boolean(age && gender && concernId);

  const selectedConcern = concernId ? getConcernById(concernId) : null;

  const recommendedSlug = useMemo(() => {
    if (!age || !gender || !concernId) return null;
    return getRecommendedProductSlug(concernId, age, gender);
  }, [age, gender, concernId]);

  const recommendedProduct = recommendedSlug ? productsBySlug[recommendedSlug] : null;

  function handleRecommend(event: React.FormEvent) {
    event.preventDefault();
    if (!isComplete) return;
    setShowResults(true);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleConcernSelect(id: string) {
    setConcernId(id);
    setShowResults(false);
    router.replace(`/know-your-concern?concern=${id}`, { scroll: false });
  }

  const pricing = recommendedProduct ? getProductPricing(recommendedProduct) : null;

  return (
    <>
      <header className="concern-finder-header">
        <div className="container-wide concern-finder-header-inner">
          <p className="concern-finder-step">{stepLabel}</p>
          <h1 className="concern-finder-title">Let&apos;s build your daily routine</h1>
          <p className="concern-finder-lead">
            Tell us a bit about yourself and your needs to define your personalized wellness plan.
          </p>
        </div>
      </header>

      <form className="concern-finder-form" onSubmit={handleRecommend}>
        <div className="container-wide concern-finder-questions">
          <section className="concern-finder-question" aria-labelledby="concern-q-age">
            <div className="concern-finder-question-head">
              <span className="concern-finder-question-num" aria-hidden>
                1
              </span>
              <h2 id="concern-q-age" className="concern-finder-question-title">
                Age Range
              </h2>
            </div>
            <div className="concern-finder-options">
              {CONCERN_FINDER_AGE_RANGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`concern-finder-pill${age === option ? ' is-selected' : ''}`}
                  aria-pressed={age === option}
                  onClick={() => {
                    setAge(option);
                    setShowResults(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="concern-finder-question" aria-labelledby="concern-q-gender">
            <div className="concern-finder-question-head">
              <span className="concern-finder-question-num" aria-hidden>
                2
              </span>
              <h2 id="concern-q-gender" className="concern-finder-question-title">
                Gender
              </h2>
            </div>
            <div className="concern-finder-options concern-finder-options--gender">
              {CONCERN_FINDER_GENDERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`concern-finder-pill concern-finder-pill--wide${gender === option ? ' is-selected' : ''}`}
                  aria-pressed={gender === option}
                  onClick={() => {
                    setGender(option);
                    setShowResults(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="concern-finder-question" aria-labelledby="concern-q-primary">
            <div className="concern-finder-question-head">
              <span className="concern-finder-question-num" aria-hidden>
                3
              </span>
              <h2 id="concern-q-primary" className="concern-finder-question-title">
                Primary Concern
              </h2>
            </div>
            <div className="concern-finder-concerns">
              {PRIMARY_CONCERNS.map((concern) => (
                <button
                  key={concern.id}
                  type="button"
                  className={`concern-finder-concern${concernId === concern.id ? ' is-selected' : ''}`}
                  aria-pressed={concernId === concern.id}
                  onClick={() => handleConcernSelect(concern.id)}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="concern-finder-submit-wrap">
          <button
            type="submit"
            className="btn-primary-dark concern-finder-submit"
            disabled={!isComplete}
          >
            Recommended Products ↓
          </button>
        </div>
      </form>

      {showResults && selectedConcern && recommendedProduct && pricing ? (
        <section
          ref={resultsRef}
          className="concern-finder-results"
          aria-labelledby="concern-results-heading"
        >
          <div className="container-wide">
            <p className="concern-finder-results-eyebrow">Results</p>
            <h2 id="concern-results-heading" className="concern-finder-results-title">
              Recommended For You
            </h2>
            <p className="concern-finder-results-subtitle">
              The Solution Optimized for{' '}
              <strong>{selectedConcern.label}</strong>
            </p>

            <article className="concern-finder-result-card">
              <Link
                href={`/products/${recommendedProduct.slug}`}
                className="concern-finder-result-media"
              >
                <span className="concern-finder-result-badge">
                  For {selectedConcern.label}
                </span>
                <Image
                  src={recommendedProduct.image || '/products/placeholder.svg'}
                  alt={recommendedProduct.name}
                  fill
                  loader={imageLoaderFor(recommendedProduct.image, 'square')}
                  className="concern-finder-result-image"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </Link>

              <div className="concern-finder-result-body">
                <p className="concern-finder-result-category">
                  {(recommendedProduct.dosageForm || recommendedProduct.category?.name || 'Product').toUpperCase()}
                </p>
                <h3 className="concern-finder-result-name">
                  <Link href={`/products/${recommendedProduct.slug}`}>
                    {recommendedProduct.name}
                  </Link>
                </h3>
                <p className="concern-finder-result-price">{formatPrice(pricing.salePrice)}</p>
                <Link
                  href={buildCartHref(recommendedProduct.slug)}
                  className={`btn-primary-dark concern-finder-result-cta${recommendedProduct.inStock ? '' : ' is-disabled'}`}
                  aria-disabled={!recommendedProduct.inStock}
                  tabIndex={recommendedProduct.inStock ? undefined : -1}
                  onClick={
                    recommendedProduct.inStock
                      ? undefined
                      : (event) => event.preventDefault()
                  }
                >
                  Add to Cart
                </Link>
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </>
  );
}
