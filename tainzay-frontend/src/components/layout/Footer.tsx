'use client';

import Link from 'next/link';
import { Mail, Phone, Plus, Minus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  FOOTER_INFORMATION,
  FOOTER_SHOP,
  FOOTER_USEFUL,
} from '@/lib/footer-links';
import SiteLogo from '@/components/layout/SiteLogo';
import { SITE } from '@/lib/site-config';
import type { NavLink } from '@/lib/navigation';

interface FooterContact {
  phoneDisplay: string;
  phoneTel: string;
  supportEmail: string;
}

interface FooterProps {
  contact?: FooterContact;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FooterLinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="footer-link-list">
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link href={link.href} className="footer-link">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterAccordion({
  title,
  links,
  open,
  onToggle,
}: {
  title: string;
  links: NavLink[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="footer-accordion">
      <button
        type="button"
        className="footer-accordion-trigger"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      {open && <FooterLinkList links={links} />}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="footer-newsletter">
      <h4 className="footer-heading">Newsletter Signup</h4>
      <p className="footer-newsletter-text">
        Get updates on wholesale offers and new pharmaceutical arrivals.
      </p>
      {submitted ? (
        <p className="footer-newsletter-success">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="footer-newsletter-form">
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="footer-newsletter-input"
          />
          <button type="submit" className="footer-newsletter-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default function Footer({ contact }: FooterProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const phoneDisplay = contact?.phoneDisplay ?? SITE.phoneDisplay;
  const phoneTel = contact?.phoneTel ?? SITE.phoneTel;
  const supportEmail = contact?.supportEmail ?? SITE.email;

  const toggleSection = (section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return (
    <footer className="footer">
      <div className="container-site footer-main">
        {/* Brand + contact */}
        <div className="footer-brand">
          <SiteLogo variant="footer" className="footer-logo" />
          <p className="footer-about">{SITE.about}</p>

          <div className="footer-contact">
            <a href={`tel:${phoneTel}`} className="footer-contact-item">
              <Phone size={16} />
              <span>{phoneDisplay}</span>
            </a>
            <a href={`mailto:${supportEmail}`} className="footer-contact-item">
              <Mail size={16} />
              <span>{supportEmail}</span>
            </a>
          </div>

          <div className="footer-social">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Desktop link columns */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">Information</h4>
            <FooterLinkList links={FOOTER_INFORMATION} />
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Shop</h4>
            <FooterLinkList links={FOOTER_SHOP} />
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Useful Links</h4>
            <FooterLinkList links={FOOTER_USEFUL} />
          </div>
        </div>

        {/* Mobile accordions */}
        <div className="footer-mobile-accordions">
          <FooterAccordion
            title="Information"
            links={FOOTER_INFORMATION}
            open={openSection === 'information'}
            onToggle={() => toggleSection('information')}
          />
          <FooterAccordion
            title="Shop"
            links={FOOTER_SHOP}
            open={openSection === 'shop'}
            onToggle={() => toggleSection('shop')}
          />
          <FooterAccordion
            title="Useful Links"
            links={FOOTER_USEFUL}
            open={openSection === 'useful'}
            onToggle={() => toggleSection('useful')}
          />
        </div>

        <NewsletterForm />
      </div>

      <div className="footer-bottom">
        <div className="container-site">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
