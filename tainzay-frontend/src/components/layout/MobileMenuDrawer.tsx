'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { NavLinks } from '@/components/layout/CategoryNav';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/site-config';
import type { NavMenuCategory } from '@/lib/nav-menu';

interface MobileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  menuCategories: NavMenuCategory[];
}

export default function MobileMenuDrawer({
  open,
  onClose,
  menuCategories,
}: MobileMenuDrawerProps) {
  const drawerId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const whatsappUrl = getWhatsAppUrl();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-menu-drawer" role="presentation">
      <button
        type="button"
        className="mobile-menu-drawer-overlay"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        id="mobile-nav-menu"
        className="mobile-menu-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${drawerId}-title`}
      >
        <div className="mobile-menu-drawer-head">
          <h2 id={`${drawerId}-title`} className="mobile-menu-drawer-title">
            Menu
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="mobile-menu-drawer-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mobile-menu-drawer-body">
          <NavLinks
            drawer
            menuCategories={menuCategories}
            onLinkClick={onClose}
          />
        </div>

        <div className="mobile-menu-drawer-footer">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-drawer-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="mobile-menu-drawer-whatsapp-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
