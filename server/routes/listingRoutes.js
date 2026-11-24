import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getListings, searchListings, getListing, createListing, updateListing, deleteListing } from '../controllers/listingController.js';

const router = Router();

router.get('/', getListings);
router.get('/search', searchListings);
router.get('/:id', getListing);
router.post('/', protect, authorize('HOST', 'ADMIN'), createListing);
router.put('/:id', protect, authorize('HOST', 'ADMIN'), updateListing);
router.delete('/:id', protect, authorize('HOST', 'ADMIN'), deleteListing);

export default router;
