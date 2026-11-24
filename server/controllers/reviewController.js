import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

export async function getReviews(req, res, next) {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment?.trim()) return res.status(400).json({ message: 'A review comment is required' });

    const eligible = await Booking.findOne({
      user: req.user._id,
      listing: req.params.listingId,
      status: { $in: ['confirmed', 'completed'] },
      checkOut: { $lt: new Date() }
    }).sort({ checkOut: -1 });
    if (!eligible) return res.status(403).json({ message: 'You can review only a completed stay' });

    if (await Review.findOne({ booking: eligible._id })) {
      return res.status(409).json({ message: 'You have already reviewed this stay' });
    }

    const review = await Review.create({
      user: req.user._id,
      listing: req.params.listingId,
      booking: eligible._id,
      rating,
      comment: comment.trim()
    });

    const stats = await Review.aggregate([
      { $match: { listing: review.listing } },
      { $group: { _id: '$listing', rating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats[0]) {
      await Listing.findByIdAndUpdate(review.listing, {
        rating: Number(stats[0].rating.toFixed(1)),
        reviewCount: stats[0].count
      });
    }
    await review.populate('user', 'name avatar');
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
}
