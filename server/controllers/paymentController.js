import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import {
  calculateRefund,
  getRazorpayKeyId,
  razorpayRequest,
  verifyPaymentSignature,
  verifyWebhookSignature
} from '../utils/razorpay.js';

const CURRENCY = 'INR';
const PAYMENT_WINDOW_MS = 15 * 60 * 1000;

function calculateBookingPrice(listing, nights) {
  const subtotal = listing.pricePerNight * nights;
  const cleaningFee = listing.cleaningFee || 0;
  const serviceFee = Math.round(subtotal * 0.1);
  return { subtotal, cleaningFee, serviceFee, totalPrice: subtotal + cleaningFee + serviceFee };
}

function refundPaymentStatus(refund, amountPaise, totalPrice) {
  if (refund.status !== 'processed') return 'refund_pending';
  return amountPaise === totalPrice * 100 ? 'refunded' : 'partially_refunded';
}

async function createRefund(booking, paymentId, amountPaise, reason) {
  return razorpayRequest(`/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: 'POST',
    body: {
      amount: amountPaise,
      notes: { bookingId: booking._id.toString(), reason }
    }
  });
}

async function refundLatePayment(booking, paymentId, amountPaise, reason) {
  const claimed = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      razorpayRefundId: { $exists: false },
      $or: [
        { status: 'pending_payment', paymentStatus: 'pending' },
        { status: 'cancelled', paymentStatus: 'expired' }
      ]
    },
    { $set: { status: 'cancelled', paymentStatus: 'refund_pending', razorpayPaymentId: paymentId } },
    { new: true }
  );
  if (!claimed) return null;

  const refund = await createRefund(booking, paymentId, amountPaise, reason);
  claimed.razorpayRefundId = refund.id;
  claimed.paymentStatus = refundPaymentStatus(refund, amountPaise, booking.totalPrice);
  claimed.refundAmount = amountPaise / 100;
  await claimed.save();
  return claimed;
}

export async function createPaymentOrder(req, res, next) {
  try {
    const { listingId, checkIn, checkOut, guests, hostMessage = '' } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listingId)) return res.status(404).json({ message: 'Listing not found' });
    if (typeof hostMessage !== 'string' || hostMessage.length > 1000) {
      return res.status(400).json({ message: 'Your message to the host must be 1,000 characters or fewer' });
    }
    const keyId = getRazorpayKeyId();
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const start = new Date(`${checkIn}T00:00:00.000Z`);
    const end = new Date(`${checkOut}T00:00:00.000Z`);
    if (!checkIn || !checkOut || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Please select valid check-in and check-out dates' });
    }
    if (start >= end) return res.status(400).json({ message: 'Check-out must be after check-in' });
    if (start <= new Date()) return res.status(400).json({ message: 'Check-in cannot be in the past' });
    if (!Number.isInteger(guests) || guests < 1 || guests > listing.maxGuests) {
      return res.status(400).json({ message: `This stay allows up to ${listing.maxGuests} guests` });
    }

    const now = new Date();
    await Booking.updateMany(
      { listing: listing._id, status: 'pending_payment', paymentExpiresAt: { $lte: now } },
      { $set: { status: 'cancelled', paymentStatus: 'expired' } }
    );
    const existingPayment = await Booking.findOne({
      user: req.user._id,
      listing: listing._id,
      checkIn: start,
      checkOut: end,
      guests,
      status: 'pending_payment',
      paymentExpiresAt: { $gt: now }
    });
    if (existingPayment?.razorpayOrderId) {
      if (hostMessage.trim() !== existingPayment.hostMessage) {
        existingPayment.hostMessage = hostMessage.trim();
        await existingPayment.save();
      }
      return res.json({
        bookingId: existingPayment._id,
        keyId,
        order: { id: existingPayment.razorpayOrderId, amount: existingPayment.totalPrice * 100, currency: CURRENCY }
      });
    }

    const conflict = await Booking.findOne({
      listing: listing._id,
      checkIn: { $lt: end },
      checkOut: { $gt: start },
      $or: [
        { status: 'confirmed' },
        { status: 'cancellation_pending' },
        { status: 'pending_payment', paymentExpiresAt: { $gt: now } }
      ]
    });
    if (conflict) return res.status(409).json({ message: 'Those dates are already booked or being checked out. Please choose another date.' });

    const nights = Math.round((end - start) / 86400000);
    const price = calculateBookingPrice(listing, nights);
    const paymentExpiresAt = new Date(now.getTime() + PAYMENT_WINDOW_MS);
    const booking = await Booking.create({
      user: req.user._id,
      listing: listing._id,
      checkIn: start,
      checkOut: end,
      guests,
      nights,
      pricePerNight: listing.pricePerNight,
      cleaningFee: price.cleaningFee,
      serviceFee: price.serviceFee,
      totalPrice: price.totalPrice,
      hostMessage: hostMessage.trim(),
      status: 'pending_payment',
      paymentStatus: 'pending',
      paymentExpiresAt
    });

    try {
      const order = await razorpayRequest('/orders', {
        method: 'POST',
        body: {
          amount: price.totalPrice * 100,
          currency: CURRENCY,
          receipt: booking._id.toString(),
          expire_by: Math.floor(paymentExpiresAt.getTime() / 1000),
          notes: { bookingId: booking._id.toString(), listingId: listing._id.toString() }
        }
      });
      if (!order.id || order.amount !== price.totalPrice * 100 || order.currency !== CURRENCY) {
        const error = new Error('The payment provider returned an invalid order.');
        error.statusCode = 502;
        throw error;
      }
      booking.razorpayOrderId = order.id;
      await booking.save();
      res.status(201).json({
        bookingId: booking._id,
        keyId,
        order: { id: order.id, amount: order.amount, currency: order.currency }
      });
    } catch (error) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'failed';
      await booking.save();
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { bookingId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) return res.status(404).json({ message: 'Booking not found' });
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.razorpayOrderId !== orderId || !verifyPaymentSignature(booking.razorpayOrderId, paymentId, signature)) {
      return res.status(400).json({ message: 'The payment could not be verified' });
    }
    if (booking.status === 'confirmed' && booking.razorpayPaymentId === paymentId) {
      await booking.populate('listing', 'title city country images');
      return res.json({ message: 'Payment verified and booking confirmed.', booking });
    }
    if (booking.razorpayPaymentId === paymentId && booking.razorpayRefundId) {
      return res.status(409).json({ message: 'A refund has already been requested for this payment.' });
    }
    if (booking.razorpayPaymentId === paymentId && ['cancellation_pending', 'cancelled'].includes(booking.status)) {
      return res.status(409).json({ message: 'This booking cancellation is already being processed.' });
    }

    let payment = await razorpayRequest(`/payments/${encodeURIComponent(paymentId)}`);
    const expectedAmount = booking.totalPrice * 100;
    if (payment.order_id !== booking.razorpayOrderId || payment.amount !== expectedAmount || payment.currency !== CURRENCY) {
      return res.status(400).json({ message: 'The payment details do not match this booking' });
    }
    if (payment.status === 'authorized') {
      payment = await razorpayRequest(`/payments/${encodeURIComponent(paymentId)}/capture`, {
        method: 'POST',
        body: { amount: expectedAmount, currency: CURRENCY }
      });
    }
    if (payment.status !== 'captured') return res.status(409).json({ message: 'Payment has not been captured. Please try again.' });

    if (booking.status !== 'pending_payment' || booking.paymentExpiresAt <= new Date()) {
      const refund = await refundLatePayment(booking, paymentId, expectedAmount, 'Payment arrived after the checkout expired');
      if (refund) return res.status(409).json({ message: 'This checkout expired, so a full refund has been requested.' });
      return res.status(409).json({ message: 'This booking can no longer be confirmed. Contact support if your payment was captured.' });
    }

    const confirmedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id, status: 'pending_payment', razorpayOrderId: orderId },
      { $set: { status: 'confirmed', paymentStatus: 'paid', razorpayPaymentId: paymentId, paymentMethod: payment.method } },
      { new: true }
    ).populate('listing', 'title city country images');
    if (!confirmedBooking) {
      const currentBooking = await Booking.findById(booking._id).populate('listing', 'title city country images');
      if (currentBooking?.status === 'confirmed' && currentBooking.razorpayPaymentId === paymentId) {
        return res.json({ message: 'Payment verified and booking confirmed.', booking: currentBooking });
      }
      const refund = await createRefund(booking, paymentId, expectedAmount, 'Booking could not be confirmed');
      await Booking.findByIdAndUpdate(booking._id, {
        $set: {
          status: 'cancelled',
          paymentStatus: refundPaymentStatus(refund, expectedAmount, booking.totalPrice),
          razorpayPaymentId: paymentId,
          razorpayRefundId: refund.id,
          refundAmount: booking.totalPrice
        }
      });
      return res.status(409).json({ message: 'The dates are no longer available, so a full refund has been requested.' });
    }

    res.json({ message: 'Payment verified and booking confirmed.', booking: confirmedBooking });
  } catch (error) {
    next(error);
  }
}

export async function paymentWebhook(req, res, next) {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return res.status(503).json({ message: 'The Razorpay webhook secret is not configured' });
    }
    const signature = req.get('x-razorpay-signature');
    if (!verifyWebhookSignature(req.body, signature)) return res.status(400).json({ message: 'Invalid webhook signature' });

    let event;
    try {
      event = JSON.parse(req.body.toString('utf8'));
    } catch {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }
    if (event.event !== 'payment.captured') return res.json({ status: 'ignored' });

    const payment = event.payload?.payment?.entity;
    if (!payment?.id || !payment.order_id) return res.status(400).json({ message: 'Webhook payment details are missing' });
    const booking = await Booking.findOne({ razorpayOrderId: payment.order_id });
    if (!booking) return res.json({ status: 'ignored' });
    if (payment.amount !== booking.totalPrice * 100 || payment.currency !== CURRENCY) {
      return res.status(400).json({ message: 'Webhook payment amount does not match the booking' });
    }
    if (booking.status === 'confirmed' && booking.razorpayPaymentId === payment.id) {
      return res.json({ status: 'already_processed' });
    }
    if (booking.status === 'cancellation_pending') {
      return res.status(503).json({ message: 'Cancellation is still processing; retry this webhook later.' });
    }
    if (booking.status === 'cancelled' && booking.razorpayPaymentId === payment.id) {
      return res.json({ status: 'already_processed' });
    }

    if (booking.status === 'pending_payment' && booking.paymentExpiresAt > new Date()) {
      await Booking.findOneAndUpdate(
        { _id: booking._id, status: 'pending_payment' },
        { $set: { status: 'confirmed', paymentStatus: 'paid', razorpayPaymentId: payment.id, paymentMethod: payment.method } }
      );
      return res.json({ status: 'confirmed' });
    }

    const refund = await refundLatePayment(booking, payment.id, payment.amount, 'Payment arrived after the checkout expired');
    res.json({ status: refund ? 'refunded' : 'already_processed' });
  } catch (error) {
    next(error);
  }
}
