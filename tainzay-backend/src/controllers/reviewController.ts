import { Request, Response } from 'express';
import Product from '../models/Product';
import Review from '../models/Review';
import { syncProductReviewStats } from '../services/reviewStats';

const PUBLIC_REVIEW_FIELDS =
  'product productName productSlug authorName rating comment status createdAt updatedAt';

function parsePagination(query: Request['query']) {
  const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(String(query.limit ?? '20'), 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function sanitizeReview(review: unknown) {
  if (!review || typeof review !== 'object') return review;
  const { email, ...rest } = review as Record<string, unknown>;
  void email;
  return rest;
}

export const submitReview = async (req: Request, res: Response) => {
  try {
    const { productSlug, authorName, email, rating, comment } = req.body;

    if (!productSlug || typeof productSlug !== 'string') {
      return res.status(400).json({ message: 'Product is required' });
    }

    if (!authorName || typeof authorName !== 'string' || !authorName.trim()) {
      return res.status(400).json({ message: 'Your name is required' });
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
      return res.status(400).json({ message: 'Review must be at least 10 characters' });
    }

    const product = await Product.findOne({ slug: productSlug.trim().toLowerCase() });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      product: product._id,
      productName: product.name,
      productSlug: product.slug,
      authorName: authorName.trim(),
      email: typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : undefined,
      rating: numericRating,
      comment: comment.trim(),
      status: 'pending',
    });

    const saved = await review.save();
    res.status(201).json({
      message: 'Thank you! Your review has been submitted and will appear after approval.',
      review: sanitizeReview(saved.toObject()),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit review';
    res.status(400).json({ message });
  }
};

export const getApprovedReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { product } = req.query;

    const filter: Record<string, unknown> = { status: 'approved' };
    if (product && typeof product === 'string' && product.trim()) {
      filter.productSlug = product.trim().toLowerCase();
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .select(PUBLIC_REVIEW_FIELDS)
        .populate('product', 'name slug image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter),
    ]);

    res.json({
      reviews: reviews.map((review) => sanitizeReview(review.toObject())),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reviews';
    res.status(500).json({ message });
  }
};

export const getReviewsByProductSlug = async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    if (!slug) {
      return res.status(400).json({ message: 'Product slug is required' });
    }

    const { page, limit, skip } = parsePagination(req.query);
    const filter = { productSlug: slug.toLowerCase(), status: 'approved' as const };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .select(PUBLIC_REVIEW_FIELDS)
        .populate('product', 'name slug image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter),
    ]);

    res.json({
      reviews: reviews.map((review) => sanitizeReview(review.toObject())),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reviews';
    res.status(500).json({ message });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: Record<string, unknown> = {};
    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const reviews = await Review.find(filter)
      .populate('product', 'name slug image')
      .sort({ createdAt: -1 });

    res.json(reviews.map((review) => sanitizeReview(review.toObject())));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reviews';
    res.status(500).json({ message });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('product', 'name slug image');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await syncProductReviewStats(review.product);

    res.json(sanitizeReview(review.toObject()));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update review';
    res.status(400).json({ message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await syncProductReviewStats(review.product);

    res.json({ message: 'Review deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete review';
    res.status(500).json({ message });
  }
};
