import express from 'express';
import { getAdminNotifications, getDashboardStats } from '../controllers/adminController';
import { getAdminSettings, patchAdminSettings } from '../controllers/settingsController';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/notifications', getAdminNotifications);
router.get('/settings', getAdminSettings);
router.patch('/settings', patchAdminSettings);

export default router;
