import { useEffect, useState } from 'react';
import api from '../services/api';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/bookings')])
      .then(([dashboardResponse, bookingsResponse]) => {
        setDashboard(dashboardResponse.data);
        setBookings(bookingsResponse.data.bookings);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load the admin dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="simple-page"><div className="skeleton-card" /></main>;
  if (error) return <main className="simple-page"><div className="error-state">{error}</div></main>;

  const { stats } = dashboard;
  const statsItems = [
    ['All accounts', stats.totalUsers],
    ['Travelers', stats.travelers],
    ['Host accounts', stats.hosts],
    ['Listings', stats.totalListings],
    ['All bookings', stats.totalBookings],
    ['Confirmed bookings', stats.confirmedBookings],
    ['Cancelled bookings', stats.cancelledBookings],
    ['Completed bookings', stats.completedBookings],
    ['Confirmed booking value', formatCurrency(stats.confirmedBookingValue)],
    ['Payments collected', formatCurrency(stats.collectedEarnings)]
  ];

  return (
    <main className="simple-page">
      <div className="host-header">
        <div><p className="eyebrow">Admin workspace</p><h1>Platform overview</h1></div>
      </div>
      <div className="stat-grid admin-stat-grid">
        {statsItems.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <p className="admin-payment-note">Payments are simulated and no money is collected. Booking value is not actual earnings.</p>
      <section className="host-panel">
        <div className="host-panel-heading"><h2>All guest bookings</h2><span>{bookings.length} total</span></div>
        {bookings.length ? <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Traveler</th><th>Stay</th><th>Dates</th><th>Guests</th><th>Status</th><th>Payment option</th><th>Booking value</th><th>Refund estimate</th></tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name || 'Unknown traveler'}<small className="table-subtext">{booking.user?.email}</small></td>
                  <td>{booking.listing?.title || 'Listing unavailable'}<small className="table-subtext">{[booking.listing?.city, booking.listing?.country].filter(Boolean).join(', ')}</small></td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>{booking.guests}</td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentStatus === 'simulated' ? `${booking.paymentMethod?.toUpperCase() || 'Payment'} selected · not processed` : 'Not processed'}</td>
                  <td>{formatCurrency(booking.totalPrice)}</td>
                  <td>{booking.status === 'cancelled' && booking.paymentStatus === 'simulated'
                    ? `${booking.simulatedRefundPercentage}% · ${formatCurrency(booking.simulatedRefundAmount)} (not issued)`
                    : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <div className="empty-state"><h2>No bookings yet</h2><p>Traveler reservations will appear here after they book a stay.</p></div>}
      </section>
    </main>
  );
}
