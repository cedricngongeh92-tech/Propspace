import express from 'express';
import {
  createInquiry,
  deleteInquiry,
  getAllInquiries,
  getMyPropertyInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/property/:propertyId', protect, createInquiry);
router.get('/my-properties', protect, getMyPropertyInquiries);
router.get('/', protect, getAllInquiries);
router.put('/:id/status', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
