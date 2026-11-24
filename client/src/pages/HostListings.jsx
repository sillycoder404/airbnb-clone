import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function HostListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/host/listings').then(({ data }) => setListings(data.listings)).catch((err) => setError(err.response?.data?.message || 'Could not load listings')); }, []);
  const remove = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try { await api.delete(`/listings/${id}`); setListings((items) => items.filter((item) => item._id !== id)); } catch (err) { alert(err.response?.data?.message || 'Could not delete listing'); }
  };
  return <main className="simple-page"><div className="host-header"><div><p className="eyebrow">Manage properties</p><h1>My listings</h1></div><Link className="primary-button" to="/host/listings/new">Add listing</Link></div>
    {error ? <div className="error-state">{error}</div> : <div className="host-listings">{listings.map(listing => <article key={listing._id}><img src={listing.images?.[0]} alt="" /><div><h2>{listing.title}</h2><p>{listing.city}, {listing.country}</p><strong>₹{listing.pricePerNight.toLocaleString('en-IN')} / night</strong></div><div className="row-actions"><Link to={`/host/listings/${listing._id}/edit`}>Edit</Link><button onClick={() => remove(listing._id)}>Delete</button></div></article>)}</div>}
  </main>;
}
