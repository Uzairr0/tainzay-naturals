import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
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
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
