import express from 'express';
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPropertyImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadPropertyImages, createProperty);
router.get('/', getAllProperties);
router.get('/:id', getSingleProperty);
router.put('/:id', protect, uploadPropertyImages, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
