import { Request, Response } from 'express';
import QuoteRequest, {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatus,
} from '../models/QuoteRequest';
import { adjustStockForItems, type StockChange } from '../services/orderStock';
import { generateOrderNumber } from '../services/orderNumber';
import { getOrCreateSiteSettings } from '../services/siteSettings';
import {
  sendAdminOrderNotifications,
  sendCustomerOrderConfirmation,
} from '../services/notifications';
import { broadcastNewOrder } from '../services/adminRealtime';

function resolveSource(body: Record<string, unknown>): 'checkout' | 'quote' {
  if (body.source === 'checkout') return 'checkout';
  const message = typeof body.message === 'string' ? body.message : '';
  if (message.toLowerCase().includes('online checkout order')) return 'checkout';
  return 'quote';
}

// Get all quote requests (admin)
export const getQuoteRequests = async (req: Request, res: Response) => {
  try {
    const { status, source } = req.query;

    const filter: Record<string, unknown> = {};
    if (status && typeof status === 'string') {
      filter.status = status;
    }
    if (source === 'checkout' || source === 'quote') {
      filter.source = source;
    }

    const quoteRequests = await QuoteRequest.find(filter)
      .populate('items.product', 'name slug image')
      .sort({ createdAt: -1 });

    res.json(quoteRequests);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    res.status(500).json({ message });
  }
};

// Get single quote request (admin)
export const getQuoteRequestById = async (req: Request, res: Response) => {
  try {
    const quoteRequest = await QuoteRequest.findById(req.params.id)
      .populate('items.product', 'name slug image basePrice wholesaleTiers');
    
    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }
    
    res.json(quoteRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/**
 * Checkout orders are prepaid: the method must be one the store has enabled and
 * the customer must give the transaction ID of their payment. Payment status is
 * always set here, never taken from the request, so an order can't arrive "paid".
 */
async function resolveCheckoutPayment(body: Record<string, unknown>) {
  const methodId = optionalString(body.paymentMethod);
  const reference = optionalString(body.paymentReference);
  const settings = await getOrCreateSiteSettings();
  const method = settings.paymentMethods.find((item) => item.enabled && item.id === methodId);

  if (!method) {
    throw new Error('Please choose one of the available payment methods.');
  }
  if (!reference) {
    throw new Error('Please enter the transaction ID of your payment.');
  }

  return {
    paymentMethod: method.id,
    paymentMethodName: method.name,
    paymentReference: reference,
    paymentStatus: 'awaiting_verification' as const,
  };
}

// Create quote request
export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    const source = resolveSource(body);
    const payment = source === 'checkout' ? await resolveCheckoutPayment(body) : {};
    const orderNumber = await generateOrderNumber();

    const quoteRequest = new QuoteRequest({
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      whatsappNumber: body.whatsappNumber,
      address: body.address,
      items: body.items,
      message: body.message,
      orderTotal: body.orderTotal,
      ...payment,
      source,
      orderNumber,
    });

    const savedQuoteRequest = await quoteRequest.save();

    void sendCustomerOrderConfirmation(savedQuoteRequest).catch((error) => {
      console.error('[order-notification:customer]', error);
    });
    void sendAdminOrderNotifications(savedQuoteRequest).catch((error) => {
      console.error('[order-notification:admin]', error);
    });
    void broadcastNewOrder(savedQuoteRequest).catch((error) => {
      console.error('[admin-realtime:order]', error);
    });

    res.status(201).json(savedQuoteRequest);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Closing a checkout order (dispatch) takes its items out of stock and dates the
 * sale for revenue; moving it away from closed puts the stock back. Each switch
 * is claimed through `stockDeducted`, so a repeated save can't count twice.
 */
async function applyOrderStatus(id: string, status: OrderStatus) {
  const order = await QuoteRequest.findById(id);
  if (!order) return null;

  if (order.source !== 'checkout') {
    order.status = status;
    return { order: await order.save(), stockChanges: [] as StockChange[] };
  }

  if (status === 'closed') {
    const claimed = await QuoteRequest.findOneAndUpdate(
      { _id: id, stockDeducted: { $ne: true } },
      { status, stockDeducted: true, closedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (claimed) {
      return { order: claimed, stockChanges: await adjustStockForItems(claimed.items, -1) };
    }
  } else {
    const released = await QuoteRequest.findOneAndUpdate(
      { _id: id, stockDeducted: true },
      { status, stockDeducted: false, $unset: { closedAt: 1 } },
      { new: true, runValidators: true }
    );
    if (released) {
      return { order: released, stockChanges: await adjustStockForItems(released.items, 1) };
    }
  }

  // Stock already matches the requested state (e.g. saving "closed" twice)
  const updated = await QuoteRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  return updated ? { order: updated, stockChanges: [] as StockChange[] } : null;
}

// Update quote request status (admin)
export const updateQuoteRequestStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const result = await applyOrderStatus(String(req.params.id), status);

    if (!result) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    res.json({ ...result.order.toJSON(), stockChanges: result.stockChanges });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order status';
    res.status(400).json({ message });
  }
};

// Update payment status after the admin checks the account (admin)
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;

    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const quoteRequest = await QuoteRequest.findOneAndUpdate(
      { _id: req.params.id, source: 'checkout' },
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Checkout order not found' });
    }

    res.json(quoteRequest);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update payment status';
    res.status(400).json({ message });
  }
};

// Delete quote request (admin)
export const deleteQuoteRequest = async (req: Request, res: Response) => {
  try {
    const quoteRequest = await QuoteRequest.findByIdAndDelete(req.params.id);
    
    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }
    
    res.json({ message: 'Quote request deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
