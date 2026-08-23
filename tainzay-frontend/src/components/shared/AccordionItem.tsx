'use client';

import { ChevronDown } from 'lucide-react';
import { useId } from 'react';

interface AccordionItemProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function AccordionItem({ title, open, onToggle, children }: AccordionItemProps) {
  const triggerId = useId();
  const panelId = useId();

  return (
    <div className={`pdp-accordion${open ? ' is-open' : ''}`}>
      <button
        type="button"
        id={triggerId}
        className="pdp-accordion-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown size={18} className="pdp-accordion-icon" aria-hidden="true" />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="pdp-accordion-panel"
        hidden={!open}
      >
        <div className="pdp-accordion-content">{children}</div>
      </div>
    </div>
  );
}
