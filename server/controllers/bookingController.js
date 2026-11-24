import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import { isDemoPaymentMethod } from '../utils/demoPayment.js';

function parseDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export async function createBooking(req, res, next) {
  try {
    const { listingId, checkIn, checkOut, guests, hostMessage = '', paymentMethod } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listingId)) return res.status(404).json({ message: 'Listing not found' });
    if (typeof hostMessage !== 'string' || hostMessage.length > 1000) {
      return res.status(400).json({ message: 'Your message to the host must be 1,000 characters or fewer' });
    }
    if (!isDemoPaymentMethod(paymentMethod)) {
      return res.status(400).json({ message: 'Choose a demo payment option: card, wallet, or UPI' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const start = parseDateOnly(checkIn);
    const end = parseDateOnly(checkOut);
    if (!start || !end) return res.status(400).json({ message: 'Please select valid check-in and check-out dates' });
    if (start >= end) return res.status(400).json({ message: 'Check-out must be after check-in' });
    if (start <= new Date()) return res.status(400).json({ message: 'Check-in cannot be in the past' });
    if (!Number.isInteger(guests) || guests < 1 || guests > listing.maxGuests) {
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
      totalPrice: subtotal + cleaningFee + serviceFee,
      hostMessage: hostMessage.trim(),
      status: 'confirmed',
      paymentStatus: 'simulated',
      paymentMethod
    });

    await booking.populate('listing', 'title city country images');
    res.status(201).json({ message: 'Demo booking confirmed. No real payment was charged.', booking });
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
    if (booking.status === 'cancelled') return res.status(409).json({ message: 'This booking is already cancelled' });
    if (booking.status !== 'confirmed') return res.status(409).json({ message: 'This booking cannot be cancelled' });

    booking.status = 'cancelled';
    await booking.save();
    const message = booking.paymentStatus === 'simulated'
      ? 'Demo booking cancelled. No payment or refund was processed.'
      : 'Booking cancelled';
    res.json({ message, booking });
  } catch (error) {
    next(error);
  }
}
