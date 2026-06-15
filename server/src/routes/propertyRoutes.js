import express from 'express';
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProperty);
router.get('/', getAllProperties);
router.get('/:id', getSingleProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
