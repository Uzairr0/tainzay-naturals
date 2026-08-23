# Tainzay - Wholesale Pharmaceutical B2B Platform

A wholesale pharmaceutical B2B website inspired by herbiotics.com.pk's visual style (clean, medical, trustworthy) but with a wholesale flow — product catalog, bulk pricing tiers, quote-request forms instead of D2C checkout, WhatsApp inquiry CTA.

## Project Structure

This is a monorepo-style project with two main folders:

- **tainzay-frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **tainzay-backend**: Express + TypeScript + Mongoose, MongoDB

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd tainzay-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tainzay
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd tainzay-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tainzay
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Seeding the Catalogue

Product data lives in `products.csv` at the repo root — one row per product,
with the Cloudinary image URL, pricing and wholesale tier. The seed script reads
that file and writes categories and products into MongoDB.

Validate the sheet without touching the database:
```bash
cd tainzay-backend
npm run seed -- --dry
```

Write to MongoDB (uses `MONGODB_URI` from `.env`):
```bash
npm run seed
```

The script is safe to re-run: categories and products are matched on their slug
and updated in place. Rows without a `categorySlug` or `basePrice` are reported
and skipped, so the catalogue can be filled in gradually. Pass a path to seed a
different file: `npm run seed -- ../other.csv`.

Category slugs in `tainzay-backend/src/data/categories.ts` must stay in sync with
`HOME_CATEGORIES` in `tainzay-frontend/src/lib/categories.ts`, which maps each
slug to its icon.

## Images

Product and banner images are hosted on Cloudinary and referenced by URL; no
files are uploaded through the API. Resizing and format conversion happen on
Cloudinary's CDN via transformations injected by
`tainzay-frontend/src/lib/cloudinary.ts`, so the original multi-megabyte assets
are never served to browsers. Product cards use the square-padding loader, which
pads portrait bottle photos to a 1:1 frame using the photo's own edge colour.

## API Endpoints

### Products
- `GET /api/products` - Paginated product listing, returns `{ products, pagination }`
- `GET /api/products/facets` - Sidebar data: category counts, availability counts, price bounds
- `GET /api/products/featured` - Get featured products (`?limit=`)
- `GET /api/products/category/:slug` - Get products by category
- `GET /api/products/:slug` - Get single product by slug
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

`GET /api/products` query parameters:

| Param | Values | Notes |
| --- | --- | --- |
| `category` | slug or ObjectId | Unknown slug returns zero results |
| `featured` | `true` | Omit for all products |
| `inStock` | `true` \| `false` | Omit for both |
| `minPrice`, `maxPrice` | number | Compared against `basePrice` |
| `search` | text | Matches name, description, manufacturer, ingredients |
| `sort` | `featured`, `best-selling`, `name-asc`, `name-desc`, `price-asc`, `price-desc`, `date-asc`, `date-desc` | Defaults to `featured` |
| `page`, `limit` | number | `limit` defaults to 24, capped at 60 |

`GET /api/products/facets` accepts the same parameters, but each facet ignores its
own filter: category counts ignore `category`, price bounds ignore
`minPrice`/`maxPrice`, and availability counts ignore `inStock`. Without that, a
selected filter would hide the alternatives you need in order to change it.

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Quotes
- `GET /api/quotes` - Get all quote requests (admin)
- `GET /api/quotes/:id` - Get single quote request (admin)
- `POST /api/quotes` - Create quote request
- `PATCH /api/quotes/:id/status` - Update quote request status (admin)
- `DELETE /api/quotes/:id` - Delete quote request (admin)

## Features

### Frontend
- **Server Components by default** - Following Next.js 14 best practices
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **Product catalog** - Browse pharmaceutical products with wholesale pricing
- **Bulk pricing tiers** - Display different prices based on quantity
- **Quote request forms** - B2B-focused inquiry system instead of checkout
- **WhatsApp integration** - Direct WhatsApp chat for quick inquiries
- **Clean medical aesthetic** - Professional, trustworthy design inspired by herbiotics.com.pk

### Backend
- **REST API** - Clean REST conventions with routes/controllers/models separation
- **MongoDB integration** - Using Mongoose for data modeling
- **TypeScript** - Full type safety across the codebase
- **CORS enabled** - Frontend-backend communication
- **Error handling** - Centralized error handling middleware

## Data Models

### Product
- name, slug, description
- category (reference)
- image, images array
- basePrice, wholesaleTiers (array of {minQuantity, price, discountPercentage})
- sku, manufacturer, activeIngredients, dosageForm, packSize
- inStock, stockQuantity, featured

### Category
- name, slug, description, image

### QuoteRequest
- companyName, contactPerson, email, phone, whatsappNumber, address
- items (array of {product, productName, quantity, requestedPrice})
- message, status (pending/reviewed/responded/closed)

## Development

### Running Both Services

For development, you'll need to run both the backend and frontend servers in separate terminals:

Terminal 1 (Backend):
```bash
cd tainzay-backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd tainzay-frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd tainzay-backend
npm run build
npm start
```

Frontend:
```bash
cd tainzay-frontend
npm run build
npm start
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name used to build image URLs

## License

ISC
