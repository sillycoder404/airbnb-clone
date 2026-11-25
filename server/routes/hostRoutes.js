import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getHostListings, getHostBookings, getDashboard, getHostReviews } from '../controllers/hostController.js';

const router = Router();
router.use(protect, authorize('HOST'));
router.get('/listings', getHostListings);
router.get('/bookings', getHostBookings);
router.get('/dashboard', getDashboard);
router.get('/reviews', getHostReviews);

export default router;
