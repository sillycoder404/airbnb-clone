import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

function parseDateOnly(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createBooking(req, res, next) {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const start = parseDateOnly(checkIn);
    const end = parseDateOnly(checkOut);
    if (!start || !end) return res.status(400).json({ message: 'Please select valid check-in and check-out dates' });
    if (start >= end) return res.status(400).json({ message: 'Check-out must be after check-in' });
    if (start <= new Date()) return res.status(400).json({ message: 'Check-in cannot be in the past' });
    if (!guests || guests < 1 || guests > listing.maxGuests) {
      return res.status(400).json({ message: `This stay allows up to ${listing.maxGuests} guests` });
    }

    const conflict = await Booking.findOne({
      listing: listing._id,
      status: 'confirmed',
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });
    if (conflict) return res.status(409).json({ message: 'Those dates are already booked. Please choose another date.' });

    const nights = Math.round((end - start) / 86400000);
    const subtotal = listing.pricePerNight * nights;
    const cleaningFee = listing.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * 0.1);
    const totalPrice = subtotal + cleaningFee + serviceFee;

    const booking = await Booking.create({
      user: req.user._id,
      listing: listing._id,
      checkIn: start,
      checkOut: end,
      guests,
      nights,
      pricePerNight: listing.pricePerNight,
      cleaningFee,
      serviceFee,
      totalPrice
    });

    await booking.populate('listing', 'title city country images');
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (error) {
    next(error);
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('listing', 'title city country images location')
      .sort({ checkIn: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'ADMIN' &&
      booking.user._id.toString() !== req.user._id.toString() &&
      booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot view this booking' });
    }
    res.json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'ADMIN' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    next(error);
  }
}
