import dotenv from 'dotenv';
import { buildOrderReceivedEmail, buildOrderReceivedMessage } from '../services/notifications/orderMessage';
import { sendOrderEmail, isEmailConfigured } from '../services/notifications/emailProvider';
import { sendOrderWhatsApp, isWhatsAppConfigured } from '../services/notifications/whatsappProvider';
import { getNotificationStatus } from '../services/notifications';

dotenv.config();

const testEmail = process.argv[2] ?? process.env.TEST_NOTIFICATION_EMAIL;
const testPhone = process.argv[3] ?? process.env.TEST_NOTIFICATION_PHONE;

const sampleQuote = {
  orderNumber: 'TZ-20260820-0099',
  contactPerson: 'Test Customer',
  companyName: 'Test Pharmacy',
  email: testEmail ?? 'customer@example.com',
  phone: testPhone ?? '03001234567',
  whatsappNumber: testPhone ?? '03001234567',
  paymentMethod: 'cod' as const,
  orderTotal: 3250,
  items: [
    { productName: 'Kof Mark Syrup', quantity: 2, requestedPrice: 450 },
    { productName: 'Medigin Tablets', quantity: 1, requestedPrice: 799 },
  ],
  message: 'Online checkout order\nPayment: Cash on Delivery\nOrder total: Rs.3,250',
};

async function main() {
  const status = getNotificationStatus();
  console.log('Notification status:', status);

  if (!isEmailConfigured() && !isWhatsAppConfigured()) {
    console.error('\nNo email or WhatsApp provider configured.');
    console.error('Add credentials to tainzay-backend/.env then run again.');
    console.error('\nUsage: npm run test:notifications [email] [phone]');
    process.exit(1);
  }

  const emailContent = buildOrderReceivedEmail(sampleQuote as never);
  const whatsappMessage = buildOrderReceivedMessage(sampleQuote as never);

  if (isEmailConfigured() && testEmail) {
    const result = await sendOrderEmail(testEmail, emailContent.subject, emailContent.text, emailContent.html);
    console.log(`Email ${result}: ${testEmail}`);
  } else if (isEmailConfigured()) {
    console.log('Email configured but no test address. Pass email as first argument or set TEST_NOTIFICATION_EMAIL.');
  }

  if (isWhatsAppConfigured() && testPhone) {
    const result = await sendOrderWhatsApp(testPhone, whatsappMessage);
    console.log(`WhatsApp ${result}: ${testPhone}`);
  } else if (isWhatsAppConfigured()) {
    console.log('WhatsApp configured but no test phone. Pass phone as second argument or set TEST_NOTIFICATION_PHONE.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
