/** Normalize to E.164 without plus, e.g. 923001234567 (Meta WhatsApp format) */
export function normalizeWhatsAppRecipient(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  if (digits.length === 10) return `92${digits}`;
  return digits;
}

/** E.164 with plus for Twilio, e.g. +923001234567 */
function toE164Plus(digits: string): string {
  return digits.startsWith('+') ? digits : `+${digits}`;
}

async function sendViaMeta(toDigits: string, body: string): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) return;

  const apiVersion = process.env.WHATSAPP_API_VERSION ?? 'v21.0';
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toDigits,
        type: 'text',
        text: { preview_url: false, body },
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Meta WhatsApp failed (${response.status}): ${detail}`);
  }
}

async function sendViaTwilio(toDigits: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) return;

  const toWhatsApp = `whatsapp:${toE164Plus(toDigits)}`;
  const fromWhatsApp = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: toWhatsApp,
        From: fromWhatsApp,
        Body: body,
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Twilio WhatsApp failed (${response.status}): ${detail}`);
  }
}

/**
 * CallMeBot: free alerts to the store owner's own WhatsApp. The API key is tied
 * to the phone that registered it, so it can only message that number, which
 * is exactly what admin order alerts need.
 */
async function sendViaCallMeBot(toDigits: string, body: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return;

  const url = new URL('https://api.callmebot.com/whatsapp.php');
  url.searchParams.set('phone', toE164Plus(toDigits));
  url.searchParams.set('text', body);
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url);
  const detail = await response.text();

  // CallMeBot answers 200 even on failure and puts the error in the page text.
  if (!response.ok || /error|invalid/i.test(detail)) {
    const text = detail.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error(`CallMeBot WhatsApp failed (${response.status}): ${text.slice(0, 300)}`);
  }
}

export function isWhatsAppConfigured(): boolean {
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) return true;
  if (process.env.CALLMEBOT_API_KEY) return true;
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM
  );
}

export function getWhatsAppProviderLabel(): string {
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return `Meta Cloud API (phone ID ${process.env.WHATSAPP_PHONE_NUMBER_ID})`;
  }
  if (process.env.TWILIO_ACCOUNT_SID) return 'Twilio WhatsApp';
  if (process.env.CALLMEBOT_API_KEY) return 'CallMeBot (alerts to store number)';
  return 'not configured (preview only)';
}

export async function sendOrderWhatsApp(to: string, body: string): Promise<'sent' | 'preview'> {
  const toDigits = normalizeWhatsAppRecipient(to);

  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    await sendViaMeta(toDigits, body);
    return 'sent';
  }

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
    await sendViaTwilio(toDigits, body);
    return 'sent';
  }

  if (process.env.CALLMEBOT_API_KEY) {
    await sendViaCallMeBot(toDigits, body);
    return 'sent';
  }

  console.log('[order-whatsapp:preview]', { to: toDigits, body });
  return 'preview';
}
