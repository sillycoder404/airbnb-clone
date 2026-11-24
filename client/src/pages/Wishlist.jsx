import { useEffect, useState } from 'react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';

export default function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/wishlist').then(({ data }) => setListings(data.listings)).finally(() => setLoading(false));
  }, []);
  return <main className="simple-page"><p className="eyebrow">Saved for later</p><h1>Wishlist</h1>
    {loading ? <div className="listing-grid"><div className="skeleton-card" /></div> : listings.length ? <div className="listing-grid">{listings.map(listing => <ListingCard key={listing._id} listing={listing} />)}</div> : <div className="empty-state"><h2>No saved stays</h2><p>Tap a heart on a listing to save it here.</p></div>}
  </main>;
}
