'use client';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { getWhatsAppUrl, SITE } from '@/lib/site-config';

interface WhatsAppCTAProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppCTA({
  phoneNumber = SITE.whatsappPhone,
  message = SITE.whatsappMessage,
}: WhatsAppCTAProps) {
  const whatsappUrl = getWhatsAppUrl(phoneNumber, message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="whatsapp-fab-icon" />
      <span className="whatsapp-fab-label">Chat</span>
    </a>
  );
}
