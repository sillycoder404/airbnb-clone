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

const landmarkPhotos = {
  Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85',
  Jaipur: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/East_facade_of_the_Hawa_Mahal%2C_Jaipur.jpg/1280px-East_facade_of_the_Hawa_Mahal%2C_Jaipur.jpg',
  Manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
  Bengaluru: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Bangalore_Palace_-_Jayamahal.jpg/1280px-Bangalore_Palace_-_Jayamahal.jpg',
  Delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85',
  Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  London: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85'
};

const jaipurStayCovers = {
  hawa: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  amber: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  jal: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
  cityPalace: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
};

const jaipurStayLandmarks = {
  hawa: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Hawa_Mahal_2011.jpg/1280px-Hawa_Mahal_2011.jpg',
  amber: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg/1280px-Jaipur_03-2016_02_Amber_Fort.jpg',
  jal: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/20191218_Jal_Mahal_Palace_in_Jaipur_1429_9234.jpg/1280px-20191218_Jal_Mahal_Palace_in_Jaipur_1429_9234.jpg',
  cityPalace: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Jaipur_03-2016_20_City_Palace_complex.jpg/1280px-Jaipur_03-2016_20_City_Palace_complex.jpg'
};

const jaipurStayGalleryHomes = {
  hawa: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  amber: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  jal: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
  cityPalace: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
};

const cityStayCovers = {
  'gurugram-1': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'gurugram-2': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  'gurugram-3': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
  'gurugram-4': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85',
  'gurugram-5': 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85',
  'gurugram-6': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'gurugram-7': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
  'gurugram-8': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
  'dehradun-1': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
  'dehradun-2': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  'dehradun-3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
  'dehradun-4': 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=85',
  'dehradun-5': 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=85',
  'dehradun-6': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
  'dehradun-7': 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=85',
  'dehradun-8': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85'
};

const coordinatesByCity = {
  Goa: { lat: 15.2993, lng: 73.8243 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bali: { lat: -8.4095, lng: 115.1889 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  London: { lat: 51.5072, lng: -0.1276 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Dehradun: { lat: 30.3165, lng: 78.0322 }
};

const listingTemplates = [
  ['Oceanfront villa in Goa', 'Goa', 'India', 'Villa', 'beach', 18000],
  ['Sea-view apartment in Mumbai', 'Mumbai', 'India', 'Apartment', 'beach', 9200],
  ['Heritage haveli in Jaipur', 'Jaipur', 'India', 'House', 'desert', 7600, 'hawa'],
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
  ['Courtyard villa in Jaipur', 'Jaipur', 'India', 'Villa', 'desert', 12000, 'amber'],
  ['Boutique room in Delhi', 'Delhi', 'India', 'Room', 'city', 4200],
  ['Lagoon villa in Dubai', 'Dubai', 'UAE', 'Villa', 'desert', 32000],
  ['Garden retreat in Bengaluru', 'Bengaluru', 'India', 'House', 'mountain', 7200],
  ['Jal Mahal lakeside retreat', 'Jaipur', 'India', 'House', 'desert', 8900, 'jal'],
  ['City Palace rooftop haveli', 'Jaipur', 'India', 'Apartment', 'desert', 10400, 'cityPalace'],
  ['Garden apartment in Gurugram', 'Gurugram', 'India', 'Apartment', 'city', 7800, 'gurugram-1'],
  ['Farm stay near Gurugram', 'Gurugram', 'India', 'House', 'city', 12500, 'gurugram-2'],
  ['Modern home in Gurugram', 'Gurugram', 'India', 'House', 'city', 9600, 'gurugram-3'],
  ['Bright flat near Cyber City', 'Gurugram', 'India', 'Apartment', 'city', 6800, 'gurugram-4'],
  ['Private villa in Gurugram', 'Gurugram', 'India', 'Villa', 'city', 16200, 'gurugram-5'],
  ['Poolside retreat in Gurugram', 'Gurugram', 'India', 'Villa', 'city', 14800, 'gurugram-6'],
  ['Guest suite near Cyber Hub', 'Gurugram', 'India', 'Apartment', 'city', 8800, 'gurugram-7'],
  ['Rooftop home in Gurugram', 'Gurugram', 'India', 'Apartment', 'city', 10500, 'gurugram-8'],
  ['Mountain-view stay in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 7200, 'dehradun-1'],
  ['Hillside cottage in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 8400, 'dehradun-2'],
  ['Garden bungalow in Dehradun', 'Dehradun', 'India', 'House', 'mountain', 6900, 'dehradun-3'],
  ['Forest-edge cabin in Dehradun', 'Dehradun', 'India', 'Cabin', 'mountain', 7600, 'dehradun-4'],
  ['Riverside home in Dehradun', 'Dehradun', 'India', 'House', 'mountain', 9100, 'dehradun-5'],
  ['Quiet villa near Mussoorie Road', 'Dehradun', 'India', 'Villa', 'mountain', 11600, 'dehradun-6'],
  ['Cedar cottage in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 7800, 'dehradun-7'],
  ['Panoramic villa in Dehradun', 'Dehradun', 'India', 'Villa', 'mountain', 13400, 'dehradun-8']
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

  const hostIds = [users[4]._id, users[5]._id];
  const listings = await Listing.insertMany(listingTemplates.map((template, index) => {
    const [title, city, country, propertyType, imageKind, price, coverPhotoKey] = template;
    return {
      title,
      description: `A thoughtfully designed ${propertyType.toLowerCase()} with warm interiors, modern comforts, and everything you need for an effortless stay in ${city}.`,
      location: `${city} city area`,
      city,
      country,
      coordinates: coordinatesByCity[city],
      pricePerNight: price,
      images: [
        jaipurStayCovers[coverPhotoKey] || cityStayCovers[coverPhotoKey] || images[imageKind][0],
        jaipurStayLandmarks[coverPhotoKey] || landmarkPhotos[city] || images[imageKind][0],
        jaipurStayGalleryHomes[coverPhotoKey] || images[imageKind][1]
      ],
      propertyType,
      bedrooms: 1 + (index % 4),
      beds: 1 + (index % 5),
      bathrooms: 1 + (index % 3),
      amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Workspace', 'Pool'].slice(0, 3 + (index % 3)),
      maxGuests: 2 + (index % 5),
      host: hostIds[index % hostIds.length],
      rating: index >= 20 ? 4.8 + (index % 3) / 10 : index === 0 ? 4.7 : 4.2 + (index % 8) / 10,
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
