import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createBooking, getMyBookings, getBooking, cancelBooking } from '../controllers/bookingController.js';

const router = Router();

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBooking);
router.delete('/:id', cancelBooking);

export default router;
