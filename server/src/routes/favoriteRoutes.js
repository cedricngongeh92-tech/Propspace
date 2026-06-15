import express from 'express';
import {
  checkSavedProperty,
  getMySavedProperties,
  removeSavedProperty,
  saveProperty,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:propertyId', protect, saveProperty);
router.get('/', protect, getMySavedProperties);
router.delete('/:propertyId', protect, removeSavedProperty);
router.get('/:propertyId/check', protect, checkSavedProperty);

export default router;
