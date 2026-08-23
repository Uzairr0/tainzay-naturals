'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openCount: number;
  openDrawer: () => void;
  drawerId: string;
}

const FilterDrawerContext = createContext<FilterDrawerContextValue | null>(null);

export function useFilterDrawer() {
  const value = useContext(FilterDrawerContext);
  if (!value) {
    throw new Error('useFilterDrawer must be used inside FilterDrawerProvider');
  }
  return value;
}

export function FilterDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const drawerId = useId();
  const openDrawer = useCallback(() => {
    setOpenCount((count) => count + 1);
    setOpen(true);
  }, []);

  return (
    <FilterDrawerContext.Provider value={{ open, setOpen, openCount, openDrawer, drawerId }}>
      {children}
    </FilterDrawerContext.Provider>
  );
}

/** Mobile-only control. The desktop sidebar in step 5 replaces it from `lg` up. */
export function FilterButton() {
  const { open, openDrawer, drawerId } = useFilterDrawer();

  return (
    <button
      type="button"
      className="collection-filter-btn"
      aria-expanded={open}
      aria-controls={drawerId}
      onClick={openDrawer}
    >
      <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
      Filter
    </button>
  );
}

/**
 * Slide-over chrome only. Step 8 fills the body with the same filters as the
 * desktop sidebar. Until then the panel still opens so the toolbar button
 * is never a dead click.
 */
export function FilterDrawer({ children }: { children?: ReactNode }) {
  const { open, setOpen, drawerId } = useFilterDrawer();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="filter-drawer" role="presentation">
      <button
        type="button"
        className="filter-drawer-overlay"
        aria-label="Close filters"
        onClick={close}
      />
      <div
        id={drawerId}
        className="filter-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${drawerId}-title`}
      >
        <div className="filter-drawer-head">
          <h2 id={`${drawerId}-title`} className="filter-drawer-title">
            Filter
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="filter-drawer-close"
            aria-label="Close filters"
            onClick={close}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="filter-drawer-body">{children}</div>
      </div>
    </div>
  );
}
