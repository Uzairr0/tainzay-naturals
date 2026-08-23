import express from 'express';
import {
  getQuoteRequests,
  getQuoteRequestById,
  createQuoteRequest,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
} from '../controllers/quoteController';

const router = express.Router();

router.get('/', getQuoteRequests);
router.get('/:id', getQuoteRequestById);
router.post('/', createQuoteRequest);
router.patch('/:id/status', updateQuoteRequestStatus);
router.delete('/:id', deleteQuoteRequest);

export default router;
