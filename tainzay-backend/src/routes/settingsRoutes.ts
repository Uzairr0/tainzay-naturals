import express from 'express';
import { cachePublic } from '../middleware/cacheHeaders';
import { getPublicSettings } from '../controllers/settingsController';

const router = express.Router();

router.get('/', cachePublic(300), getPublicSettings);

export default router;
