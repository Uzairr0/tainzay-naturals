import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  getQuoteRequests,
  getQuoteRequestById,
  createQuoteRequest,
  updateQuoteRequestStatus,
  updatePaymentStatus,
  deleteQuoteRequest,
} from '../controllers/quoteController';

const router = express.Router();

router.get('/', requireAdmin, getQuoteRequests);
router.get('/:id', requireAdmin, getQuoteRequestById);
router.post('/', createQuoteRequest);
router.patch('/:id/status', requireAdmin, updateQuoteRequestStatus);
router.patch('/:id/payment-status', requireAdmin, updatePaymentStatus);
router.delete('/:id', requireAdmin, deleteQuoteRequest);

export default router;
