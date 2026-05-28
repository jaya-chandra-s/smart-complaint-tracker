import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = Router();

router.route('/')
  .get(protect, getComplaints)
  .post(protect, upload.single('image'), createComplaint);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, upload.single('image'), updateComplaint)
  .delete(protect, deleteComplaint);

export default router;
