import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';
import { generateOrderNumber } from '../services/orderNumber';
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

// Create quote request
export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const source = resolveSource(req.body);
    const orderNumber = await generateOrderNumber();

    const quoteRequest = new QuoteRequest({
      ...req.body,
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

// Update quote request status (admin)
export const updateQuoteRequestStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const quoteRequest = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }
    
    res.json(quoteRequest);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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
