import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getUsers, getListings, getBookings, removeListing, removeReview } from '../controllers/adminController.js';

const router = Router();
router.use(protect, authorize('ADMIN'));
router.get('/users', getUsers);
router.get('/listings', getListings);
router.get('/bookings', getBookings);
router.delete('/listings/:id', removeListing);
router.delete('/reviews/:id', removeReview);

export default router;
