import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Sparkles, CalendarDays } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';

const categories = [
  ['Beach', '🏖️'], ['Mountains', '⛰️'], ['Countryside', '🌿'], ['City', '🏙️'],
  ['Luxury', '✨'], ['Trending', '🔥'], ['Cabins', '🪵'], ['Amazing views', '🌅']
];
const destinations = [
  ['Goa', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=85'],
  ['Jaipur', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f096?auto=format&fit=crop&w=700&q=85'],
  ['Bali', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=85'],
  ['Dubai', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=85']
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ destination: '', checkIn: '', checkOut: '', guests: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listings?limit=8')
      .then(({ data }) => setListings(data.listings))
      .catch(() => setError('We could not load stays. Please check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Find your next favorite place</p>
          <h1>Find a place you'll<br />love to stay</h1>
          <form className="hero-search" onSubmit={submitSearch}>
            <label><span>Destination</span><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Where to?" /></label>
            <label><span>Check in</span><input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} /></label>
            <label><span>Check out</span><input type="date" value={form.checkOut} min={form.checkIn} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} /></label>
            <label><span>Guests</span><select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label>
            <button aria-label="Search stays"><Search size={20} /> <span>Search</span></button>
          </form>
        </div>
      </section>

      <section className="categories">
        {categories.map(([name, icon]) => (
          <button key={name} onClick={() => navigate(`/search?destination=${name === 'Beach' ? 'Goa' : name === 'Mountains' ? 'Manali' : ''}`)}>
            <span>{icon}</span>{name}
          </button>
        ))}
      </section>

      <section className="section">
        <div className="section-heading"><div><p className="eyebrow">Handpicked for you</p><h2>Featured stays</h2></div></div>
        {loading ? <div className="listing-grid">{[1,2,3,4].map(n => <div className="skeleton-card" key={n} />)}</div>
          : error ? <div className="error-state">{error}</div>
          : <div className="listing-grid">{listings.map(listing => <ListingCard key={listing._id} listing={listing} />)}</div>}
      </section>

      <section className="section destination-section">
        <div className="section-heading"><div><p className="eyebrow">Explore somewhere new</p><h2>Popular destinations</h2></div></div>
        <div className="destination-grid">
          {destinations.map(([name, image]) => <button key={name} onClick={() => navigate(`/search?destination=${name}`)}><img src={image} alt={name} /><span>{name}<small>Explore stays</small></span></button>)}
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
