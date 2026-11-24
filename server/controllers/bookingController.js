import Booking from '../models/Booking.js';
import { calculateRefund, razorpayRequest } from '../utils/razorpay.js';

export async function getMyBookings(req, res, next) {
  try {
    await Booking.updateMany(
      { user: req.user._id, status: 'pending_payment', paymentExpiresAt: { $lte: new Date() } },
      { $set: { status: 'cancelled', paymentStatus: 'expired' } }
    );
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

    if (booking.status === 'pending_payment') {
      const cancelled = await Booking.findOneAndUpdate(
        { _id: booking._id, status: 'pending_payment' },
        { $set: { status: 'cancelled', paymentStatus: 'expired' } },
        { new: true }
      );
      if (!cancelled) return res.status(409).json({ message: 'This checkout is already being processed' });
      return res.json({ message: 'Unpaid checkout cancelled', booking: cancelled });
    }

    if (booking.status !== 'confirmed') {
      return res.status(409).json({ message: 'This booking cannot be cancelled while another update is in progress' });
    }

    if (booking.paymentStatus === 'paid' && !booking.razorpayPaymentId) {
      return res.status(409).json({ message: 'The payment reference is missing; contact support before cancelling' });
    }
    const refund = booking.paymentStatus === 'paid'
      ? calculateRefund(booking.totalPrice, booking.checkIn)
      : null;
    const claimed = await Booking.findOneAndUpdate(
      { _id: booking._id, status: 'confirmed' },
      {
        $set: {
          status: 'cancellation_pending',
          ...(refund && {
            paymentStatus: refund.amountPaise > 0 ? 'refund_pending' : 'not_refundable',
            refundAmount: refund.amountPaise / 100
          })
        }
      },
      { new: true }
    );
    if (!claimed) return res.status(409).json({ message: 'This booking is already being processed' });

    if (booking.paymentStatus === 'paid') {
      if (refund.amountPaise > 0) {
        const result = await razorpayRequest(`/payments/${encodeURIComponent(booking.razorpayPaymentId)}/refund`, {
          method: 'POST',
          body: {
            amount: refund.amountPaise,
            notes: { bookingId: booking._id.toString(), reason: 'Guest cancellation' }
          }
        });
        claimed.razorpayRefundId = result.id;
        claimed.paymentStatus = result.status === 'processed'
          ? refund.percentage === 100 ? 'refunded' : 'partially_refunded'
          : 'refund_pending';
      } else {
        claimed.paymentStatus = 'not_refundable';
        claimed.refundAmount = 0;
      }
    }

    claimed.status = 'cancelled';
    await claimed.save();
    const message = booking.paymentStatus === 'paid'
      ? claimed.refundAmount
        ? `Booking cancelled. A ₹${claimed.refundAmount.toLocaleString('en-IN')} refund has been requested.`
        : 'Booking cancelled. No refund applies within 24 hours of check-in.'
      : 'Booking cancelled';
    res.json({ message, booking: claimed });
  } catch (error) {
    next(error);
  }
}
