import express from 'express';
import {
  getAdminDashboardStats,
  getMyDashboardStats,
} from '../controllers/dashboardController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-stats', protect, getMyDashboardStats);
router.get('/admin-stats', protect, adminOnly, getAdminDashboardStats);

export default router;
