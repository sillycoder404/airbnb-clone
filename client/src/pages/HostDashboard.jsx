import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function HostDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/host/dashboard').then(({ data }) => setData(data)).catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'));
  }, []);
  if (error) return <main className="simple-page"><div className="error-state">{error}</div></main>;
  if (!data) return <main className="simple-page"><div className="skeleton-card" /></main>;
  const { stats, recentReservations, listingPerformance } = data;
  return <main className="simple-page">
    <div className="host-header"><div><p className="eyebrow">Host workspace</p><h1>Dashboard</h1></div><div className="row-actions"><Link to="/host/bookings">View reservations</Link><Link className="primary-button" to="/host/listings/new">Add listing</Link></div></div>
    <div className="stat-grid">
      <div><span>Total listings</span><strong>{stats.totalListings}</strong></div>
      <div><span>Total reservations</span><strong>{stats.totalReservations}</strong></div>
      <div><span>Booking value (not collected)</span><strong>₹{stats.totalBookingValue.toLocaleString('en-IN')}</strong></div>
      <div><span>Average rating</span><strong>{stats.averageRating} ★</strong></div>
    </div>
    <section className="host-panel"><div className="host-panel-heading"><h2>Recent reservations</h2><Link to="/host/bookings">View all</Link></div>{recentReservations.length ? <div className="table-wrap"><table><thead><tr><th>Guest</th><th>Stay</th><th>Dates</th><th>Status</th><th>Total</th></tr></thead><tbody>{recentReservations.map(item => <tr key={item._id}><td>{item.user?.name}<small className="table-subtext">{item.user?.email}</small></td><td>{item.listing?.title}<small className="table-subtext">{item.listing?.city}</small></td><td>{new Date(item.checkIn).toLocaleDateString()} – {new Date(item.checkOut).toLocaleDateString()}</td><td>{item.status}</td><td>₹{item.totalPrice.toLocaleString('en-IN')}</td></tr>)}</tbody></table></div> : <p>No reservations yet.</p>}</section>
    <section className="host-panel"><h2>Listing performance</h2>{listingPerformance.map(item => <div className="performance-row" key={item.id}><strong>{item.title}</strong><span>₹{item.pricePerNight.toLocaleString('en-IN')} / night</span><span>{item.rating} ★ · {item.reviewCount} reviews</span></div>)}</section>
  </main>;
}
