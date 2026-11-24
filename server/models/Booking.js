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
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed', index: true }
}, { timestamps: true });

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });

export default mongoose.model('Booking', bookingSchema);
