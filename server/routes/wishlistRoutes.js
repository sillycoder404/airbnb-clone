import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getWishlist, addWishlist, removeWishlist } from '../controllers/wishlistController.js';

const router = Router();
router.use(protect);
router.get('/', getWishlist);
router.post('/:listingId', addWishlist);
router.delete('/:listingId', removeWishlist);

export default router;
