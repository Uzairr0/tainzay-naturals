import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import { getAdminNotifications, getDashboardStats } from '../controllers/adminController';
import { getAdminSettings, patchAdminSettings } from '../controllers/settingsController';

const router = express.Router();

router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/notifications', getAdminNotifications);
router.get('/settings', getAdminSettings);
router.patch('/settings', patchAdminSettings);

export default router;
