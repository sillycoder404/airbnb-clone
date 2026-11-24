import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Could not load trips'))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((items) => items.map((item) => item._id === id ? { ...item, status: 'cancelled' } : item));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  return <main className="simple-page"><div className="section-heading"><div><p className="eyebrow">Your journey</p><h1>My trips</h1></div></div>
    {loading ? <div className="skeleton-card" /> : error ? <div className="error-state">{error}</div> :
      bookings.length ? <div className="trip-list">{bookings.map(booking => <article className="trip-card" key={booking._id}>
        <Link to={`/listings/${booking.listing._id}`}><img src={booking.listing.images?.[0]} alt={booking.listing.title} /></Link>
        <div><span className={`status ${booking.status}`}>{booking.status}</span><h2>{booking.listing.title}</h2><p>{booking.listing.city}, {booking.listing.country}</p><p>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()} · {booking.guests} guests</p><strong>₹{booking.totalPrice?.toLocaleString('en-IN')} total</strong></div>
        {booking.status === 'confirmed' && <button className="text-button" onClick={() => cancel(booking._id)}>Cancel booking</button>}
      </article>)}</div> : <div className="empty-state"><h2>No trips yet</h2><p>Discover a place for your next memorable stay.</p><Link className="primary-button" to="/search">Explore stays</Link></div>}
  </main>;
}
