import { Request, Response } from 'express';
import Product from '../models/Product';
import QuoteRequest from '../models/QuoteRequest';
import Review from '../models/Review';
import { getAdminNotificationsPayload, summarizeOrderItems } from '../services/adminNotifications';

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);
  return start;
}

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export const getAdminNotifications = async (_req: Request, res: Response) => {
  try {
    const payload = await getAdminNotificationsPayload();
    res.json(payload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load notifications';
    res.status(500).json({ message });
  }
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const weekStart = startOfWeek();
    const monthStart = startOfMonth();
    const checkoutFilter = { source: 'checkout' as const };

    const [
      ordersThisWeek,
      ordersThisMonth,
      monthOrders,
      pendingReviews,
      outOfStockProducts,
      recentOrders,
      pendingReviewsList,
    ] = await Promise.all([
      QuoteRequest.countDocuments({ ...checkoutFilter, createdAt: { $gte: weekStart } }),
      QuoteRequest.countDocuments({ ...checkoutFilter, createdAt: { $gte: monthStart } }),
      QuoteRequest.find({ ...checkoutFilter, createdAt: { $gte: monthStart } }).select('orderTotal'),
      Review.countDocuments({ status: 'pending' }),
      Product.countDocuments({ inStock: false }),
      QuoteRequest.find(checkoutFilter)
        .sort({ createdAt: -1 })
        .limit(8)
        .select('orderNumber contactPerson orderTotal status source createdAt items'),
      Review.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('productName productSlug authorName rating comment createdAt'),
    ]);

    const revenueThisMonth = monthOrders.reduce((sum, order) => sum + (order.orderTotal ?? 0), 0);
    const averageOrderValue =
      ordersThisMonth > 0 ? Math.round((revenueThisMonth / ordersThisMonth) * 100) / 100 : 0;

    res.json({
      kpis: {
        ordersThisWeek,
        ordersThisMonth,
        revenueThisMonth,
        pendingReviews,
        averageOrderValue,
        outOfStockProducts,
      },
      recentOrders: recentOrders.map((order) => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        contactPerson: order.contactPerson,
        orderTotal: order.orderTotal,
        status: order.status,
        source: order.source,
        createdAt: order.createdAt,
        productSummary: summarizeOrderItems(order.items),
      })),
      pendingReviews: pendingReviewsList.map((review) => ({
        _id: review._id,
        productName: review.productName,
        productSlug: review.productSlug,
        authorName: review.authorName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load dashboard stats';
    res.status(500).json({ message });
  }
};
