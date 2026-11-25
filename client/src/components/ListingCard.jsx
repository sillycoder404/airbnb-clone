import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSaved = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return navigate('/login');
    try {
      if (saved) await api.delete(`/wishlist/${listing._id}`);
      else await api.post(`/wishlist/${listing._id}`);
      setSaved(!saved);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update saved listings');
    }
  };

  return (
    <Link className="listing-card" to={`/listings/${listing._id}`}>
      <div className="card-image">
        <img
          src={imageFailed ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' : listing.images?.[0]}
          alt={listing.title}
          onError={() => setImageFailed(true)}
        />
        {listing.rating >= 4.8 && <span className="guest-favorite">Guest favourite</span>}
        <button className={`heart ${saved ? 'saved' : ''}`} onClick={toggleSaved} aria-label={saved ? 'Remove from wishlist' : 'Save listing'}>
          <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="card-meta">
        <p>{listing.propertyType} · {listing.city}</p>
        <span><Star size={14} fill="currentColor" /> {listing.rating?.toFixed(1) || 'New'}</span>
      </div>
      <h3>{listing.title}</h3>
      <p className="card-info">{listing.beds ? `${listing.beds} bed${listing.beds === 1 ? '' : 's'} · ` : ''}{listing.bedrooms} bedrooms · Up to {listing.maxGuests} guests</p>
      <p className="price"><strong>₹{listing.pricePerNight?.toLocaleString('en-IN')}</strong> night</p>
    </Link>
  );
}
