import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export async function getUsers(req, res, next) {
  try {
    res.json({ users: await User.find().select('-password').sort({ createdAt: -1 }) });
  } catch (error) {
    next(error);
  }
}

export async function getListings(req, res, next) {
  try {
    res.json({ listings: await Listing.find().populate('host', 'name email').sort({ createdAt: -1 }) });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    res.json({
      bookings: await Booking.find()
        .populate('user', 'name email')
        .populate('listing', 'title city country')
        .sort({ createdAt: -1 })
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const [
      totalUsers,
      travelers,
      hosts,
      totalListings,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      bookingValue,
      collectedEarnings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'HOST' }),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    res.json({
      stats: {
        totalUsers,
        travelers,
        hosts,
        totalListings,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        confirmedBookingValue: bookingValue[0]?.total || 0,
        collectedEarnings: collectedEarnings[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function removeListing(req, res, next) {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    await Promise.all([
      Booking.deleteMany({ listing: listing._id }),
      Review.deleteMany({ listing: listing._id })
    ]);
    res.json({ message: 'Listing and related records removed' });
  } catch (error) {
    next(error);
  }
}

export async function removeReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const reviews = await Review.find({ listing: review.listing });
    const rating = reviews.length
      ? Number((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1))
      : 0;
    await Listing.findByIdAndUpdate(review.listing, { rating, reviewCount: reviews.length });
    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
}
