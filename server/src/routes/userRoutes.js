import express from 'express';
import {
  changeMyPassword,
  deleteUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
  updateMyProfile,
  updateUserRole,
} from '../controllers/userController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/change-password', protect, changeMyPassword);

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getSingleUser);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
