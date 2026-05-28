import { Router } from 'express';
import {
  getAllComplaints,
  updateComplaintStatus,
  getStats,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

export default router;
