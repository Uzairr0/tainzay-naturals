'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Items visible per breakpoint for product-style carousels */
export function useItemsPerPage(
  breakpoints: { mobile: number; tablet: number; desktop: number } = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
) {
  // Mobile-first default: the server render matches phones, so small screens
  // don't re-chunk (and visibly re-flow) right after hydration.
  const [itemsPerPage, setItemsPerPage] = useState(breakpoints.mobile);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerPage(breakpoints.mobile);
      else if (window.innerWidth < 1024) setItemsPerPage(breakpoints.tablet);
      else setItemsPerPage(breakpoints.desktop);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoints.mobile, breakpoints.tablet, breakpoints.desktop]);

  return itemsPerPage;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Horizontal swipe helpers for carousels */
export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, threshold = 40) {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(delta) < threshold) return;
      if (delta < 0) onSwipeLeft();
      else onSwipeRight();
    },
    [onSwipeLeft, onSwipeRight, threshold],
  );

  return { onTouchStart, onTouchEnd };
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages.length > 0 ? pages : [[]];
}
