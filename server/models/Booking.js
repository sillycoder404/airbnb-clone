import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 1 },
  pricePerNight: { type: Number, required: true },
  cleaningFee: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  hostMessage: { type: String, trim: true, maxlength: 1000, default: '' },
  status: { type: String, enum: ['pending_payment', 'cancellation_pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed', index: true },
  paymentStatus: { type: String, enum: ['not_required', 'pending', 'paid', 'failed', 'expired', 'partially_refunded', 'refund_pending', 'refunded', 'not_refundable'], default: 'not_required' },
  paymentExpiresAt: { type: Date },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpayRefundId: { type: String },
  paymentMethod: { type: String },
  refundAmount: { type: Number, min: 0, default: 0 }
}, { timestamps: true });

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });
bookingSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Booking', bookingSchema);
