import mongoose from 'mongoose';
import Product from '../models/Product';
import Review from '../models/Review';

export async function syncProductReviewStats(
  productId: mongoose.Types.ObjectId | string
): Promise<void> {
  const objectId =
    typeof productId === 'string' ? new mongoose.Types.ObjectId(productId) : productId;

  const stats = await Review.aggregate<{ avgRating: number; count: number }>([
    { $match: { product: objectId, status: 'approved' } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = stats[0];
  const reviewCount = summary?.count ?? 0;
  const avgRating = summary?.avgRating ?? 0;
  const rating =
    reviewCount > 0 ? Math.round((avgRating + Number.EPSILON) * 10) / 10 : undefined;

  await Product.findByIdAndUpdate(objectId, {
    rating: reviewCount > 0 ? rating : undefined,
    reviewCount: reviewCount > 0 ? reviewCount : undefined,
  });
}
