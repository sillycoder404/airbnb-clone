import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';

const images = {
  beach: [
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85'
  ],
  city: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85'
  ],
  desert: [
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85'
  ]
};

const listingTemplates = [
  ['Oceanfront villa in Goa', 'Goa', 'India', 'Villa', 'beach', 18000],
  ['Sea-view apartment in Mumbai', 'Mumbai', 'India', 'Apartment', 'beach', 9200],
  ['Heritage haveli in Jaipur', 'Jaipur', 'India', 'House', 'desert', 7600],
  ['Glass cabin in Manali', 'Manali', 'India', 'Cabin', 'mountain', 6800],
  ['Modern loft in Bengaluru', 'Bengaluru', 'India', 'Apartment', 'city', 6100],
  ['Design home in Delhi', 'Delhi', 'India', 'House', 'city', 8200],
  ['Palm resort in Bali', 'Bali', 'Indonesia', 'Resort', 'beach', 14000],
  ['Luxury apartment in Dubai', 'Dubai', 'UAE', 'Apartment', 'city', 22000],
  ['Parisian studio near the Seine', 'Paris', 'France', 'Apartment', 'city', 16500],
  ['Townhouse in London', 'London', 'United Kingdom', 'House', 'city', 19500],
  ['Forest cottage near Goa', 'Goa', 'India', 'Cottage', 'mountain', 5400],
  ['Mountain chalet in Manali', 'Manali', 'India', 'Cabin', 'mountain', 9800],
  ['Beach bungalow in Bali', 'Bali', 'Indonesia', 'Cottage', 'beach', 8500],
  ['Penthouse in Mumbai', 'Mumbai', 'India', 'Apartment', 'city', 28000],
  ['Courtyard villa in Jaipur', 'Jaipur', 'India', 'Villa', 'desert', 12000],
  ['Boutique room in Delhi', 'Delhi', 'India', 'Room', 'city', 4200],
  ['Lagoon villa in Dubai', 'Dubai', 'UAE', 'Villa', 'desert', 32000],
  ['Garden retreat in Bengaluru', 'Bengaluru', 'India', 'House', 'mountain', 7200]
];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Listing.deleteMany(), Booking.deleteMany(), Review.deleteMany(), Wishlist.deleteMany()]);

  const users = await User.create([
    { name: 'Andrew Wilson', email: 'demo@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Aarav Mehta', email: 'aarav@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Ravi Sharma', email: 'ravi@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Saniya Khan', email: 'saniya@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=44' },
    { name: 'Demo Host', email: 'host@staynest.com', password: 'Host123!', role: 'HOST', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Maya Kapoor', email: 'maya@staynest.com', password: 'Demo123!', role: 'HOST', avatar: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Airbnb Clone Admin', email: 'admin@staynest.com', password: 'Admin123!', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?img=5' }
  ]);

  const hostIds = [users[2]._id, users[3]._id];
  const listings = await Listing.insertMany(listingTemplates.map((template, index) => {
    const [title, city, country, propertyType, imageKind, price] = template;
    return {
      title,
      description: `A thoughtfully designed ${propertyType.toLowerCase()} with warm interiors, modern comforts, and everything you need for an effortless stay in ${city}.`,
      location: `${city} city area`,
      city,
      country,
      coordinates: {
        lat: [15.2993, 19.076, 26.9124, 32.2396, 12.9716, 28.6139, -8.4095, 25.2048, 48.8566, 51.5072][index % 10],
        lng: [73.8243, 72.8777, 75.7873, 77.1887, 77.5946, 77.209, 115.1889, 55.2708, 2.3522, -0.1276][index % 10]
      },
      pricePerNight: price,
      images: [
        images[imageKind][0],
        images[imageKind][1],
        images.city[0]
      ],
      propertyType,
      bedrooms: 1 + (index % 4),
      beds: 1 + (index % 5),
      bathrooms: 1 + (index % 3),
      amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Workspace', 'Pool'].slice(0, 3 + (index % 3)),
      maxGuests: 2 + (index % 5),
      host: hostIds[index % hostIds.length],
      rating: index === 0 ? 4.7 : 4.2 + (index % 8) / 10,
      reviewCount: index === 0 ? 3 : 8 + (index % 40),
      cleaningFee: 600 + (index % 4) * 150,
      instantBooking: index % 3 !== 0
    };
  }));

  const now = new Date();
  const pastCheckIn = new Date(now);
  pastCheckIn.setDate(now.getDate() - 10);
  const pastCheckOut = new Date(now);
  pastCheckOut.setDate(now.getDate() - 7);
  const raviCheckIn = new Date(now);
  raviCheckIn.setDate(now.getDate() - 35);
  const raviCheckOut = new Date(now);
  raviCheckOut.setDate(now.getDate() - 32);
  const saniyaCheckIn = new Date(now);
  saniyaCheckIn.setDate(now.getDate() - 21);
  const saniyaCheckOut = new Date(now);
  saniyaCheckOut.setDate(now.getDate() - 18);

  const bookings = await Booking.insertMany([
    {
      user: users[0]._id, listing: listings[0]._id, checkIn: pastCheckIn, checkOut: pastCheckOut,
      guests: 2, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    },
    {
      user: users[1]._id, listing: listings[1]._id, checkIn: new Date(now.getTime() + 86400000 * 12),
      checkOut: new Date(now.getTime() + 86400000 * 15), guests: 2, nights: 3,
      pricePerNight: listings[1].pricePerNight, cleaningFee: listings[1].cleaningFee,
      serviceFee: 2760, totalPrice: 30460, status: 'confirmed'
    },
    {
      user: users[2]._id, listing: listings[0]._id, checkIn: raviCheckIn, checkOut: raviCheckOut,
      guests: 3, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    },
    {
      user: users[3]._id, listing: listings[0]._id, checkIn: saniyaCheckIn, checkOut: saniyaCheckOut,
      guests: 2, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    }
  ]);

  await Review.insertMany([
    { user: users[0]._id, listing: listings[0]._id, booking: bookings[0]._id, rating: 5, comment: 'The villa was spotless, the pool area was beautiful, and we woke up to a calm ocean view every morning. The host was quick to help throughout our stay.' },
    { user: users[2]._id, listing: listings[0]._id, booking: bookings[2]._id, rating: 5, comment: 'One of the best family stays we have had in Goa. The rooms were spacious, breakfast was excellent, and the beach was only a short walk away.' },
    { user: users[3]._id, listing: listings[0]._id, booking: bookings[3]._id, rating: 4, comment: 'A peaceful and well-designed villa with beautiful interiors. Check-in was smooth, and we loved relaxing by the pool after exploring Goa.' },
    { user: users[1]._id, listing: listings[1]._id, booking: bookings[1]._id, rating: 4, comment: 'Great location and a comfortable apartment. The neighborhood has plenty of cafes and the sea view was lovely.' }
  ]);
  await Wishlist.insertMany([
    { user: users[0]._id, listing: listings[2]._id },
    { user: users[0]._id, listing: listings[6]._id }
  ]);

  console.log(`Seed complete: ${users.length} users, ${listings.length} listings, ${bookings.length} bookings`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
