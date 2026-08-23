import express from 'express';
import { cachePublic } from '../middleware/cacheHeaders';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

router.get('/', cachePublic(300), getCategories);
router.get('/:slug', cachePublic(300), getCategoryBySlug);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
