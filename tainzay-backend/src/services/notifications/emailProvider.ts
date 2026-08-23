import nodemailer from 'nodemailer';

const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'Tainzay';
const FROM_EMAIL = process.env.SMTP_FROM ?? process.env.RESEND_FROM ?? 'orders@tainzay.com';

function formatFromAddress(): string {
  return `${FROM_NAME} <${FROM_EMAIL}>`;
}

async function sendViaResend(to: string, subject: string, text: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: formatFromAddress(),
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend email failed (${response.status}): ${detail}`);
  }
}

async function sendViaSmtp(to: string, subject: string, text: string, html: string): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return;

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: formatFromAddress(),
    to,
    subject,
    text,
    html,
  });
}

export function isEmailConfigured(): boolean {
  if (process.env.RESEND_API_KEY) return true;
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getEmailProviderLabel(): string {
  if (process.env.RESEND_API_KEY) return 'Resend';
  if (process.env.SMTP_HOST) return `SMTP (${process.env.SMTP_HOST})`;
  return 'not configured (preview only)';
}

export async function sendOrderEmail(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<'sent' | 'preview'> {
  if (process.env.RESEND_API_KEY) {
    await sendViaResend(to, subject, text, html);
    return 'sent';
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendViaSmtp(to, subject, text, html);
    return 'sent';
  }

  console.log('[order-email:preview]', { to, subject, text });
  return 'preview';
}
