import Listing from '../models/Listing.js';

export async function getListings(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const listings = await Listing.find().populate('host', 'name avatar').sort({ createdAt: -1 }).limit(limit);
    res.json({ listings });
  } catch (error) {
    next(error);
  }
}

export async function searchListings(req, res, next) {
  try {
    const {
      destination, checkIn, checkOut, guests, minPrice, maxPrice, propertyType,
      bedrooms, beds, bathrooms, amenities, rating, instant, sort
    } = req.query;

    const filter = {};
    if (destination) {
      const value = destination.trim();
      filter.$or = [
        { city: { $regex: value, $options: 'i' } },
        { country: { $regex: value, $options: 'i' } },
        { location: { $regex: value, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (propertyType) filter.propertyType = { $in: String(propertyType).split(',') };
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (beds) filter.beds = { $gte: Number(beds) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (guests) filter.maxGuests = { $gte: Number(guests) };
    if (amenities) filter.amenities = { $all: String(amenities).split(',') };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (instant === 'true') filter.instantBooking = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { pricePerNight: 1 };
    if (sort === 'price-high') sortOption = { pricePerNight: -1 };
    if (sort === 'rating') sortOption = { rating: -1, reviewCount: -1 };

    let listings = await Listing.find(filter).populate('host', 'name avatar').sort(sortOption);

    if (checkIn && checkOut) {
      const Booking = (await import('../models/Booking.js')).default;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const conflicts = await Booking.find({
        status: 'confirmed',
        checkIn: { $lt: end },
        checkOut: { $gt: start }
      }).distinct('listing');
      const conflictIds = new Set(conflicts.map((id) => id.toString()));
      listings = listings.filter((listing) => !conflictIds.has(listing._id.toString()));
    }

    res.json({ listings, count: listings.length });
  } catch (error) {
    next(error);
  }
}

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name avatar createdAt');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ listing });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found' });
    next(error);
  }
}

export async function createListing(req, res, next) {
  try {
    const listing = await Listing.create({ ...req.body, host: req.user._id });
    res.status(201).json({ listing });
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (req.user.role !== 'ADMIN' && listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json({ listing });
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (req.user.role !== 'ADMIN' && listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    next(error);
  }
}
