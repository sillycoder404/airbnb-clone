import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Sparkles, CalendarDays } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';

const categories = [
  ['Beach', '🏖️'], ['Mountains', '⛰️'], ['Countryside', '🌿'], ['City', '🏙️'],
  ['Luxury', '✨'], ['Trending', '🔥'], ['Cabins', '🪵'], ['Amazing views', '🌅']
];
const destinations = [
  { name: 'Goa', landmark: 'Palolem Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=85' },
  { name: 'Mumbai', landmark: 'Gateway of India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=700&q=85' },
  { name: 'Jaipur', landmark: 'Jantar Mantar', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Jaipur_Jantar_Mantar_panorama_2011.jpg/1280px-Jaipur_Jantar_Mantar_panorama_2011.jpg' },
  { name: 'Manali', landmark: 'Himalayan peaks', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=85' },
  { name: 'Bengaluru', landmark: 'Bangalore Palace', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Bangalore_Palace_-_Jayamahal.jpg/1280px-Bangalore_Palace_-_Jayamahal.jpg' },
  { name: 'Delhi', landmark: 'India Gate', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=85' },
  { name: 'Bali', landmark: 'Ulun Danu Temple', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=85' },
  { name: 'Dubai', landmark: 'Burj Khalifa skyline', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=85' },
  { name: 'Paris', landmark: 'Eiffel Tower', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=85' },
  { name: 'London', landmark: 'Tower Bridge', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=85' }
];

const cityOrder = ['Delhi', 'Gurugram', 'Dehradun', 'Jaipur', 'Goa', 'Mumbai', 'Manali', 'Bengaluru', 'Bali', 'Dubai'];

function groupListingsByCity(listings) {
  const grouped = listings.reduce((groups, listing) => {
    const city = listing.city?.trim();
    if (city) groups.set(city, [...(groups.get(city) || []), listing]);
    return groups;
  }, new Map());

  const orderedCities = [
    ...cityOrder.filter((city) => grouped.has(city)),
    ...[...grouped.keys()].filter((city) => !cityOrder.includes(city)).sort()
  ];

  return orderedCities
    .map((city) => ({
      city,
      listings: grouped.get(city).sort((a, b) =>
        (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0)
      )
    }))
    .filter(({ listings: cityListings }) => cityListings.length >= 4);
}

function CityStaySection({ city, listings, loading, onExplore }) {
  const carouselRef = useRef(null);
  const heading = city === 'Delhi'
    ? 'Available in Delhi this weekend'
    : city === 'Dehradun'
      ? 'Available in Dehradun this weekend'
      : city === 'Gurugram'
        ? 'Stay in Gurugram'
        : `Popular homes in ${city}`;

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector('.listing-card');
    carousel.scrollBy({ left: direction * (card?.getBoundingClientRect().width || 240) * 2, behavior: 'smooth' });
  };

  return (
    <section className="city-stays-section">
      <div className="city-stays-heading">
        <div className="city-title">
          <h2>{heading}</h2>
          <button onClick={() => onExplore(city)} aria-label={`Explore stays in ${city}`}>→</button>
        </div>
        <div className="carousel-controls">
          <button onClick={() => scrollCarousel(-1)} aria-label={`Scroll ${city} stays left`}>‹</button>
          <button onClick={() => scrollCarousel(1)} aria-label={`Scroll ${city} stays right`}>›</button>
        </div>
      </div>
      {loading
        ? <div className="stay-carousel">{[1, 2, 3, 4, 5, 6].map((n) => <div className="skeleton-card" key={n} />)}</div>
        : <div className="stay-carousel" ref={carouselRef}>
          {listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
        </div>}
    </section>
  );
}

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ destination: '', checkIn: '', checkOut: '', guests: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listings?limit=50')
      .then(({ data }) => setListings(data.listings))
      .catch(() => setError('We could not load stays. Please check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);
  const citySections = listings.length
    ? groupListingsByCity(listings)
    : loading
      ? cityOrder.slice(1, 3).map((city) => ({ city, listings: [] }))
      : [];

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main>
      <section className="categories">
        {categories.map(([name, icon]) => (
          <button key={name} onClick={() => navigate(`/search?destination=${name === 'Beach' ? 'Goa' : name === 'Mountains' ? 'Manali' : ''}`)}>
            <span>{icon}</span>{name}
          </button>
        ))}
      </section>

      <section className="hero home-search">
        <div className="hero-content">
          <h1 className="sr-only">Find a place you'll love to stay</h1>
          <form className="hero-search" onSubmit={submitSearch}>
            <label><span>Destination</span><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Where to?" /></label>
            <label><span>Check in</span><input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} /></label>
            <label><span>Check out</span><input type="date" value={form.checkOut} min={form.checkIn} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} /></label>
            <label><span>Guests</span><select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label>
            <button aria-label="Search stays"><Search size={20} /> <span>Search</span></button>
          </form>
        </div>
      </section>

      {error ? <div className="error-state home-error">{error}</div>
        : citySections.map(({ city, listings: cityListings }) => (
          <CityStaySection key={city} city={city} listings={cityListings} loading={loading} onExplore={(destination) => navigate(`/search?destination=${encodeURIComponent(destination)}`)} />
        ))}

      <section className="section destination-section">
        <div className="section-heading"><div><p className="eyebrow">Explore somewhere new</p><h2>Popular destinations</h2></div></div>
        <div className="destination-grid">
          {destinations.map(({ name, landmark, image }) => <button key={name} onClick={() => navigate(`/search?destination=${name}`)}><img src={image} alt={`${landmark}, ${name}`} /><span>{name}<small>{landmark}</small></span></button>)}
        </div>
      </section>

      <section className="why">
        <div><ShieldCheck /><h3>Book with confidence</h3><p>Secure booking and clear, upfront pricing.</p></div>
        <div><Sparkles /><h3>Exceptional places</h3><p>Handpicked homes for every kind of journey.</p></div>
        <div><CalendarDays /><h3>Flexible travel</h3><p>Simple reservations and easy trip management.</p></div>
      </section>

      <section className="host-banner">
        <div><p className="eyebrow">Share your space</p><h2>Turn your extra space into a welcoming stay</h2><p>Join the Airbnb Clone host community and reach travelers around the world.</p></div>
        <button onClick={() => navigate('/register')}>Become a host</button>
      </section>
    </main>
  );
}
