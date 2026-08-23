'use client';

import { useState } from 'react';
import AccordionItem from '@/components/shared/AccordionItem';
import { getProductAccordionPanels } from '@/lib/product-accordions';
import type { Product } from '@/types';

interface ProductAccordionsProps {
  product: Product;
}

export default function ProductAccordions({ product }: ProductAccordionsProps) {
  const panels = getProductAccordionPanels(product);
  const [openIds, setOpenIds] = useState<string[]>(
    panels.filter((panel) => panel.defaultOpen).map((panel) => panel.id),
  );

  function togglePanel(id: string) {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((panelId) => panelId !== id) : [...current, id],
    );
  }

  return (
    <section className="pdp-accordions" aria-label="Additional product information">
      {panels.map((panel) => (
        <AccordionItem
          key={panel.id}
          title={panel.title}
          open={openIds.includes(panel.id)}
          onToggle={() => togglePanel(panel.id)}
        >
          {(panel.paragraphs ?? []).map((paragraph, index) => (
            <p key={`${panel.id}-p-${index}`} className="pdp-accordion-paragraph">
              {paragraph}
            </p>
          ))}

          {panel.meta && panel.meta.length > 0 && (
            <dl className="pdp-accordion-meta">
              {panel.meta.map((item) => (
                <div key={item.label} className="pdp-accordion-meta-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {panel.bullets && panel.bullets.length > 0 && (
            <>
              {panel.bulletsHeading && (
                <p className="pdp-accordion-subtitle">{panel.bulletsHeading}</p>
              )}
              <ul className="pdp-accordion-list">
                {panel.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {panel.faqs && panel.faqs.length > 0 && (
            <dl className="pdp-accordion-faqs">
              {panel.faqs.map((faq) => (
                <div key={faq.question} className="pdp-accordion-faq">
                  <dt>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          )}
        </AccordionItem>
      ))}
    </section>
  );
}
