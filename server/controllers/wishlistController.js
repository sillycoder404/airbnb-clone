import Wishlist from '../models/Wishlist.js';

export async function getWishlist(req, res, next) {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate({
      path: 'listing',
      populate: { path: 'host', select: 'name avatar' }
    });
    res.json({ listings: items.map((item) => item.listing).filter(Boolean) });
  } catch (error) {
    next(error);
  }
}

export async function addWishlist(req, res, next) {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id, listing: req.params.listingId },
      { user: req.user._id, listing: req.params.listingId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ message: 'Added to saved listings' });
  } catch (error) {
    next(error);
  }
}

export async function removeWishlist(req, res, next) {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id, listing: req.params.listingId });
    res.json({ message: 'Removed from saved listings' });
  } catch (error) {
    next(error);
  }
}
