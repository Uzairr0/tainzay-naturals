import mongoose from 'mongoose';
import Product from '../models/Product';
import type { IQuoteItem } from '../models/QuoteRequest';

export interface StockChange {
  productName: string;
  before: number;
  after: number;
}

/**
 * Adds `direction * quantity` to each item's product stock (never below zero).
 * When a sale empties a product it is marked out of stock; restoring stock
 * leaves availability to the admin, who may have hidden it on purpose.
 */
export async function adjustStockForItems(
  items: IQuoteItem[],
  direction: -1 | 1,
): Promise<StockChange[]> {
  const changes: StockChange[] = [];

  for (const item of items) {
    if (!mongoose.isValidObjectId(item.product) || !(item.quantity > 0)) continue;

    const delta = direction * item.quantity;
    const before = await Product.findOneAndUpdate(
      { _id: item.product },
      [
        {
          $set: {
            stockQuantity: {
              $max: [0, { $add: [{ $ifNull: ['$stockQuantity', 0] }, delta] }],
            },
          },
        },
      ],
      { returnDocument: 'before', updatePipeline: true },
    ).select('name stockQuantity');

    if (!before) continue;

    const previous = before.stockQuantity ?? 0;
    const after = Math.max(0, previous + delta);

    if (direction === -1 && after === 0) {
      await Product.updateOne({ _id: item.product }, { inStock: false });
    }

    changes.push({ productName: before.name ?? item.productName, before: previous, after });
  }

  return changes;
}
