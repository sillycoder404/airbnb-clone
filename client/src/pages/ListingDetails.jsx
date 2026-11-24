import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Star, MapPin, Users, BedDouble, Bath, CalendarDays } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const landmarkNames = {
  Goa: 'Goa beach',
  Mumbai: 'Gateway of India',
  Jaipur: 'Hawa Mahal',
  Manali: 'Himalayan peaks',
  Bengaluru: 'Bangalore Palace',
  Delhi: 'India Gate',
  Bali: 'Ulun Danu Temple',
  Dubai: 'Dubai skyline',
  Paris: 'Eiffel Tower',
  London: 'Tower Bridge'
};

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get(`/listings/${id}`), api.get(`/listings/${id}/reviews`)])
      .then(([listingData, reviewData]) => { setListing(listingData.data.listing); setReviews(reviewData.data.reviews); })
      .catch((err) => setError(err.response?.data?.message || 'Listing not found'));
  }, [id]);

  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;
  const subtotal = (listing?.pricePerNight || 0) * nights;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + cleaningFee + serviceFee;

  const reserve = async () => {
    if (!user) return navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
    if (!checkIn || !checkOut) return setMessage('Please select check-in and check-out dates');
    setBooking(true);
    setMessage('');
    try {
      const { data } = await api.post('/bookings', { listingId: id, checkIn, checkOut, guests });
      setMessage(data.message);
      setTimeout(() => navigate('/trips'), 900);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to complete your booking');
    } finally {
      setBooking(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) return navigate('/login');
    setReviewMessage('');
    try {
      const { data } = await api.post(`/listings/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews((items) => [data.review, ...items]);
      setReviewComment('');
      setReviewMessage('Thank you for sharing your experience.');
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Could not submit your review');
    }
  };

  if (error) return <main className="page-state"><div className="error-state">{error}</div></main>;
  if (!listing) return <main className="detail-loading"><div className="skeleton-card" /><div className="skeleton-card" /></main>;

  return (
    <main className="detail-page">
      <h1>{listing.title}</h1>
      <div className="detail-location"><span><MapPin size={16} /> {listing.location}, {listing.city}, {listing.country}</span><span><Star size={16} fill="currentColor" /> {listing.rating?.toFixed(1)} · {listing.reviewCount} reviews</span></div>
      <div className="gallery">
        {listing.images?.slice(0, 5).map((image, index) => <img key={image} className={index === 0 ? 'main-image' : ''} src={image} alt={index === 1 ? `${landmarkNames[listing.city] || listing.city} near ${listing.city}` : `${listing.title} view ${index + 1}`} />)}
      </div>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="host-line"><div><h2>{listing.propertyType} hosted by {listing.host?.name || 'Airbnb Clone Host'}</h2><p><Users size={16} /> {listing.maxGuests} guests · <BedDouble size={16} /> {listing.bedrooms} bedrooms · <Bath size={16} /> {listing.bathrooms} baths</p></div><img src={listing.host?.avatar || 'https://i.pravatar.cc/100?img=47'} alt="" /></div>
          <hr />
          <h2>About this place</h2><p>{listing.description}</p>
          <h2>What this place offers</h2><div className="amenities">{listing.amenities?.map(item => <span key={item}>✓ {item}</span>)}</div>
          <h2>Where you'll be</h2>
          <div className="map-placeholder"><MapPin size={32} /><strong>{listing.city}, {listing.country}</strong><span>Exact location shared after booking</span></div>
          <h2>Reviews</h2>
          {reviews.length ? reviews.map(review => <article className="review" key={review._id}><img src={review.user?.avatar || 'https://i.pravatar.cc/80'} alt="" /><div><strong>{review.user?.name}</strong><span><Star size={13} fill="currentColor" /> {review.rating}</span><p>{review.comment}</p></div></article>) : <p>No reviews yet.</p>}
          {user && <form className="review-form" onSubmit={submitReview}>
            <h3>Share your experience</h3>
            <label>Rating
              <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
                {[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
              </select>
            </label>
            <label>Comment<textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} required /></label>
            {reviewMessage && <div className="booking-message">{reviewMessage}</div>}
            <button className="primary-button" type="submit">Submit review</button>
          </form>}
        </section>
        <aside className="booking-card">
          <div className="booking-price"><strong>₹{listing.pricePerNight?.toLocaleString('en-IN')}</strong> night</div>
          <div className="date-grid"><label>Check-in<input type="date" value={checkIn} min={new Date().toISOString().slice(0,10)} onChange={(e) => setCheckIn(e.target.value)} /></label><label>Check-out<input type="date" value={checkOut} min={checkIn || new Date().toISOString().slice(0,10)} onChange={(e) => setCheckOut(e.target.value)} /></label></div>
          <label className="guest-field">Guests<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label>
          {nights > 0 && <div className="price-breakdown"><p><span>₹{listing.pricePerNight?.toLocaleString('en-IN')} × {nights} nights</span><span>₹{subtotal.toLocaleString('en-IN')}</span></p><p><span>Cleaning fee</span><span>₹{cleaningFee.toLocaleString('en-IN')}</span></p><p><span>Service fee</span><span>₹{serviceFee.toLocaleString('en-IN')}</span></p><p className="total"><strong>Total</strong><strong>₹{total.toLocaleString('en-IN')}</strong></p></div>}
          {message && <div className="booking-message">{message}</div>}
          <button className="reserve-button" onClick={reserve} disabled={booking}>{booking ? 'Confirming...' : 'Reserve'}</button>
          <small>You won't be charged yet</small>
        </aside>
      </div>
    </main>
  );
}
