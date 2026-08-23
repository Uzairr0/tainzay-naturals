import express from 'express';
import { cachePublic } from '../middleware/cacheHeaders';
import {
  getProducts,
  getProductFacets,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from '../controllers/productController';

const router = express.Router();

router.get('/', cachePublic(60), getProducts);
router.get('/featured', cachePublic(120), getFeaturedProducts);
router.get('/facets', cachePublic(60), getProductFacets);
router.get('/id/:id', getProductById);
router.get('/category/:slug', cachePublic(60), getProductsByCategory);
router.get('/:slug', cachePublic(120), getProductBySlug);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
