import { Request, Response } from 'express';
import { SortOrder, Types } from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';

/** Mongoose 9 no longer exports FilterQuery, so the shape is declared locally. */
type ProductFilter = {
  category?: Types.ObjectId | null;
  featured?: boolean;
  inStock?: boolean;
  basePrice?: { $gte?: number; $lte?: number };
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;

export const SORT_OPTIONS = {
  featured: { featured: -1, createdAt: -1 },
  // Stand-in until order history exists: promoted items first, then newest
  'best-selling': { featured: -1, createdAt: -1 },
  'name-asc': { name: 1 },
  'name-desc': { name: -1 },
  'price-asc': { basePrice: 1 },
  'price-desc': { basePrice: -1 },
  'date-asc': { createdAt: 1 },
  'date-desc': { createdAt: -1 },
} satisfies Record<string, Record<string, SortOrder>>;

export type SortKey = keyof typeof SORT_OPTIONS;

function resolveSort(sort: unknown): Record<string, SortOrder> {
  const key = typeof sort === 'string' ? sort : '';
  return key in SORT_OPTIONS
    ? SORT_OPTIONS[key as SortKey]
    : SORT_OPTIONS.featured;
}

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function toPrice(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** Filters a facet can leave out so its own options stay reachable */
type OmittableFilter = 'category' | 'inStock' | 'price';

/**
 * Builds the Mongo filter shared by the listing endpoint and the facet counts.
 * `category` accepts either a slug or an ObjectId so links stay readable.
 */
async function buildFilter(
  query: Request['query'],
  omit: OmittableFilter[] = []
): Promise<ProductFilter> {
  const { category, featured, inStock, search, minPrice, maxPrice } = query;
  const filter: ProductFilter = {};

  if (!omit.includes('category') && typeof category === 'string' && category) {
    if (Types.ObjectId.isValid(category) && category.length === 24) {
      filter.category = new Types.ObjectId(category);
    } else {
      const found = await Category.findOne({ slug: category }).select('_id');
      // No such category: force an empty result rather than ignoring the filter
      filter.category = found ? found._id : null;
    }
  }

  if (featured === 'true') filter.featured = true;
  if (!omit.includes('inStock')) {
    if (inStock === 'true') filter.inStock = true;
    if (inStock === 'false') filter.inStock = false;
  }

  const min = omit.includes('price') ? undefined : toPrice(minPrice);
  const max = omit.includes('price') ? undefined : toPrice(maxPrice);
  if (min !== undefined || max !== undefined) {
    filter.basePrice = {
      ...(min !== undefined ? { $gte: min } : {}),
      ...(max !== undefined ? { $lte: max } : {}),
    };
  }

  if (typeof search === 'string' && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { manufacturer: { $regex: term, $options: 'i' } },
      { activeIngredients: { $regex: term, $options: 'i' } },
    ];
  }

  return filter;
}

/**
 * GET /api/products
 * Filters: category (slug or id), featured, inStock, search, minPrice, maxPrice
 * Sorting: sort=featured|best-selling|name-asc|name-desc|price-asc|price-desc|date-asc|date-desc
 * Paging:  page, limit
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const filter = await buildFilter(req.query);
    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(toPositiveInt(req.query.limit, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(resolveSort(req.query.sort))
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/products/facets
 * Sidebar data: per-category counts, availability counts and price bounds.
 * Each facet ignores its own filter — otherwise selecting a category would hide
 * the other categories, and narrowing the price would shrink the slider bounds
 * until they could no longer be widened again.
 */
export const getProductFacets = async (req: Request, res: Response) => {
  try {
    const [categoryFilter, priceFilter, availabilityFilter] = await Promise.all([
      buildFilter(req.query, ['category']),
      buildFilter(req.query, ['price']),
      buildFilter(req.query, ['inStock']),
    ]);

    const [categories, bounds, availability] = await Promise.all([
      Product.aggregate([
        { $match: categoryFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        {
          $project: {
            _id: 0,
            name: '$category.name',
            slug: '$category.slug',
            count: 1,
          },
        },
        { $sort: { name: 1 } },
      ]),
      Product.aggregate([
        { $match: priceFilter },
        {
          $group: {
            _id: null,
            min: { $min: '$basePrice' },
            max: { $max: '$basePrice' },
          },
        },
      ]),
      Product.aggregate([
        { $match: availabilityFilter },
        { $group: { _id: '$inStock', count: { $sum: 1 } } },
      ]),
    ]);

    const inStockCount = availability.find((entry) => entry._id === true)?.count ?? 0;
    const outOfStockCount = availability.find((entry) => entry._id === false)?.count ?? 0;

    res.json({
      categories,
      priceRange: {
        min: bounds[0]?.min ?? 0,
        max: bounds[0]?.max ?? 0,
      },
      availability: { inStock: inStockCount, outOfStock: outOfStockCount },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by Mongo id (admin)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid product id is required' });
    }

    const product = await Product.findById(id).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
    res.status(500).json({ message });
  }
};

// Get single product by slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: 'Slug is required' });
    }
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug description')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/products/category/:slug
 * The category field holds an ObjectId, so the slug has to be resolved first.
 */
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: 'Category slug is required' });
    }

    const category = await Category.findOne({ slug }).select('_id name slug');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id })
      .populate('category', 'name slug')
      .sort({ name: 1 })
      .lean();

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update product (admin) — only catalogue fields the admin panel may change
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const allowedFields = ['basePrice', 'inStock', 'stockQuantity', 'featured'] as const;
    const updates: Partial<Record<(typeof allowedFields)[number], unknown>> = {};

    for (const field of allowedFields) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    res.status(400).json({ message });
  }
};

// Delete product (admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(toPositiveInt(req.query.limit, 12), MAX_PAGE_SIZE);

    const products = await Product.find({ featured: true, inStock: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
