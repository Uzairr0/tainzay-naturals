import express from 'express';
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
router.get('/', getReviews);
router.post('/', submitReview);
router.patch('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

export default router;
