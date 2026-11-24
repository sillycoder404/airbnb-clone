import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export async function getHostListings(req, res, next) {
  try {
    const listings = await Listing.find({ host: req.user._id }).sort({ createdAt: -1 });
    res.json({ listings });
  } catch (error) {
    next(error);
  }
}

export async function getHostBookings(req, res, next) {
  try {
    const listings = await Listing.find({ host: req.user._id }).select('_id');
    const ids = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listing: { $in: ids } })
      .populate('listing', 'title city images')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const listings = await Listing.find({ host: req.user._id });
    const ids = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listing: { $in: ids }, status: 'confirmed' })
      .populate('listing', 'title city images')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const averageRating = listings.length
      ? listings.reduce((sum, listing) => sum + listing.rating, 0) / listings.length
      : 0;
    res.json({
      stats: {
        totalListings: listings.length,
        totalReservations: bookings.length,
        totalRevenue,
        averageRating: Number(averageRating.toFixed(1))
      },
      recentReservations: bookings.slice(0, 8),
      listingPerformance: listings.map((listing) => ({
        id: listing._id,
        title: listing.title,
        rating: listing.rating,
        reviewCount: listing.reviewCount,
        pricePerNight: listing.pricePerNight
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function getHostReviews(req, res, next) {
  try {
    const listings = await Listing.find({ host: req.user._id }).select('_id');
    const reviews = await Review.find({ listing: { $in: listings.map((listing) => listing._id) } })
      .populate('user', 'name avatar')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
}
