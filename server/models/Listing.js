import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, maxlength: 4000 },
  location: { type: String, required: true },
  city: { type: String, required: true, index: true },
  country: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  pricePerNight: { type: Number, required: true, min: 1 },
  images: [{ type: String, required: true }],
  propertyType: { type: String, required: true, enum: ['House', 'Apartment', 'Villa', 'Cabin', 'Cottage', 'Room', 'Resort'] },
  bedrooms: { type: Number, required: true, min: 0 },
  beds: { type: Number, required: true, min: 1 },
  bathrooms: { type: Number, required: true, min: 1 },
  amenities: [{ type: String }],
  maxGuests: { type: Number, required: true, min: 1 },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  cleaningFee: { type: Number, default: 0, min: 0 },
  instantBooking: { type: Boolean, default: true }
}, { timestamps: true });

listingSchema.index({ city: 1, pricePerNight: 1, rating: -1 });

export default mongoose.model('Listing', listingSchema);
