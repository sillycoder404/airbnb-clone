import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getReviews, createReview } from '../controllers/reviewController.js';

const router = Router({ mergeParams: true });
router.get('/', getReviews);
router.post('/', protect, createReview);

export default router;
