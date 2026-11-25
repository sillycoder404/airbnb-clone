import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/host/bookings')
      .then(({ data }) => setBookings(data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Could not load reservations'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="simple-page">
      <div className="host-header">
        <div><p className="eyebrow">Host workspace</p><h1>Guest reservations</h1></div>
        <Link to="/host">Back to dashboard</Link>
      </div>
      {loading ? <div className="skeleton-card" /> : error ? <div className="error-state">{error}</div> :
        bookings.length ? (
          <section className="host-panel">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Guest</th><th>Stay</th><th>Dates</th><th>Guests</th><th>Status</th><th>Payment option</th><th>Total</th><th>Refund estimate</th></tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.user?.name}<small className="table-subtext">{booking.user?.email}</small></td>
                      <td>{booking.listing?.title}<small className="table-subtext">{booking.listing?.city}, {booking.listing?.country}</small></td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td>{booking.guests}</td>
                      <td>{booking.status.replaceAll('_', ' ')}</td>
                      <td>{booking.paymentStatus === 'simulated' ? `${booking.paymentMethod?.toUpperCase()} selected · not processed` : '—'}</td>
                      <td>₹{booking.totalPrice.toLocaleString('en-IN')}</td>
                      <td>{booking.status === 'cancelled' && booking.paymentStatus === 'simulated'
                        ? `${booking.simulatedRefundPercentage}% · ₹${booking.simulatedRefundAmount.toLocaleString('en-IN')} (not issued)`
                        : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : <div className="empty-state"><h2>No reservations yet</h2><p>Guest names and stay details will appear here after someone books one of your listings.</p></div>}
    </main>
  );
}
