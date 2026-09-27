import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  deleteReview,
  getApprovedReviews,
  getReviews,
  getReviewsByProductSlug,
  submitReview,
  updateReviewStatus,
} from '../controllers/reviewController';

const router = express.Router();

router.get('/approved', getApprovedReviews);
router.get('/product/:slug', getReviewsByProductSlug);
router.get('/', requireAdmin, getReviews);
router.post('/', submitReview);
router.patch('/:id/status', requireAdmin, updateReviewStatus);
router.delete('/:id', requireAdmin, deleteReview);

export default router;
