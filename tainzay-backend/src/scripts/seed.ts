/**
 * Seeds categories and products into MongoDB.
 *
 * Usage:  npm run seed [-- path/to/products.csv] [--dry]
 *
 * --dry validates the CSV and reports what would be written without touching
 * the database, which is useful before the connection string exists.
 *
 * Safe to re-run: categories and products are matched on their slug and
 * updated in place, so nothing is duplicated. Rows missing a category or a
 * price are reported and skipped, which lets the catalogue be filled in
 * gradually.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import { CATEGORIES } from '../data/categories';
import { getProductHighlights } from '../data/product-highlights';
import { getProductDetails } from '../data/product-details';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry');
const csvArg = args.find((arg) => !arg.startsWith('--'));

const DEFAULT_CSV = path.resolve(__dirname, '../../../products.csv');
const csvPath = csvArg ? path.resolve(csvArg) : DEFAULT_CSV;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tainzay';

type Row = Record<string, string>;

/** Minimal RFC 4180 parser: handles quoted fields, escaped quotes and CRLF. */
function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows;
  if (!header) return [];

  return body
    .filter((cells) => cells.some((cell) => cell.trim() !== ''))
    .map((cells) => {
      const entry: Row = {};
      header.forEach((column, index) => {
        entry[column.trim()] = (cells[index] ?? '').trim();
      });
      return entry;
    });
}

/**
 * Tolerates prices written as "1,690", "Rs.1690" or "Rs. 1,690.00". Matching the
 * first number rather than stripping non-digits matters: stripping would leave
 * the dot in "Rs.250" and yield 0.25.
 */
function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return /^(true|yes|1|y)$/i.test(value.trim());
}

function toList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function seedCategories(): Promise<Map<string, mongoose.Types.ObjectId>> {
  const bySlug = new Map<string, mongoose.Types.ObjectId>();

  for (const category of CATEGORIES) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    bySlug.set(category.slug, saved!._id as mongoose.Types.ObjectId);
  }

  return bySlug;
}

async function seedProducts(categoryIds: Map<string, mongoose.Types.ObjectId>) {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const skipped: string[] = [];
  const preview: string[] = [];
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const label = row.name || row.slug || '(unnamed row)';

    if (!row.slug || !row.name || !row.image) {
      skipped.push(`${label}: missing name, slug or image`);
      continue;
    }

    const categoryId = row.categorySlug ? categoryIds.get(row.categorySlug) : undefined;
    if (!categoryId) {
      skipped.push(
        row.categorySlug
          ? `${label}: unknown categorySlug "${row.categorySlug}"`
          : `${label}: no categorySlug yet`
      );
      continue;
    }

    const basePrice = toNumber(row.basePrice);
    if (basePrice === undefined) {
      skipped.push(`${label}: no basePrice yet`);
      continue;
    }

    const tierMinQuantity = toNumber(row.tierMinQuantity);
    const tierPrice = toNumber(row.tierPrice);
    const wholesaleTiers = [];

    if (tierMinQuantity !== undefined && tierPrice !== undefined) {
      const explicitDiscount = toNumber(row.tierDiscountPercentage);
      wholesaleTiers.push({
        minQuantity: tierMinQuantity,
        price: tierPrice,
        discountPercentage:
          explicitDiscount ??
          (basePrice > tierPrice
            ? Math.round(((basePrice - tierPrice) / basePrice) * 100)
            : undefined),
      });
    }

    const slug = row.slug.toLowerCase();
    const highlights = getProductHighlights(slug);
    const productDetails = getProductDetails(slug);

    const update = {
      name: row.name,
      slug,
      description: row.description || '',
      category: categoryId,
      image: row.image,
      images: toList(row.extraImages),
      basePrice,
      wholesaleTiers,
      // A blank SKU must stay undefined: the index is unique+sparse, so empty
      // strings would collide across products.
      ...(row.sku ? { sku: row.sku } : {}),
      manufacturer: row.manufacturer || undefined,
      activeIngredients: toList(row.activeIngredients),
      dosageForm: row.dosageForm || undefined,
      packSize: row.packSize || undefined,
      ...(highlights
        ? {
            benefits: highlights.benefits,
            packSizeDetail: highlights.packSizeDetail,
            packSizeLabel: highlights.packSizeLabel,
            sizeOptions: highlights.sizeOptions,
          }
        : {}),
      ...(productDetails ? { productDetails } : {}),
      inStock: toBoolean(row.inStock, true),
      stockQuantity: toNumber(row.stockQuantity) ?? 0,
      featured: toBoolean(row.featured, false),
    };

    const tier = wholesaleTiers[0];
    preview.push(
      `${update.name} — Rs.${basePrice}` +
        (tier
          ? ` | ${tier.minQuantity}+ units at Rs.${tier.price} (${tier.discountPercentage ?? 0}% off)`
          : ' | no wholesale tier') +
        (update.featured ? ' | featured' : '')
    );

    if (dryRun) {
      created += 1;
      continue;
    }

    const existing = await Product.findOne({ slug: update.slug }).select('_id');
    await Product.findOneAndUpdate({ slug: update.slug }, { $set: update }, {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    });

    if (existing) updated += 1;
    else created += 1;
  }

  return { created, updated, skipped, preview, total: rows.length };
}

async function main() {
  let categoryIds: Map<string, mongoose.Types.ObjectId>;

  if (dryRun) {
    console.log('Dry run: validating CSV only, nothing will be written.');
    categoryIds = new Map(
      CATEGORIES.map((category) => [category.slug, new mongoose.Types.ObjectId()])
    );
  } else {
    console.log(`Connecting to ${MONGODB_URI.replace(/\/\/[^@]+@/, '//***@')}`);
    await mongoose.connect(MONGODB_URI);
    categoryIds = await seedCategories();
    console.log(`Categories ready: ${categoryIds.size}`);
  }

  const result = await seedProducts(categoryIds);
  console.log(`\nProducts from ${csvPath}`);
  console.log(`  rows read : ${result.total}`);
  console.log(`  ${dryRun ? 'ready     ' : 'created   '}: ${result.created}`);
  if (!dryRun) console.log(`  updated   : ${result.updated}`);
  console.log(`  skipped   : ${result.skipped.length}`);

  if (result.preview.length > 0) {
    console.log('\nPricing parsed from the sheet (check these read correctly):');
    result.preview.forEach((line) => console.log(`  - ${line}`));
  }

  if (result.skipped.length > 0) {
    console.log('\nSkipped rows (fill these in and re-run):');
    result.skipped.forEach((reason) => console.log(`  - ${reason}`));
  }

  if (!dryRun) await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(async (error) => {
  console.error('\nSeed failed:', error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
