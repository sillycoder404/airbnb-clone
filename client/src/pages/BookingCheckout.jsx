import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Star, Wallet } from 'lucide-react';
import api from '../services/api';

function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const paymentOptions = [
  { value: 'card', label: 'Card', description: 'Credit or debit card', Icon: CreditCard },
  { value: 'wallet', label: 'Wallet', description: 'Digital wallet', Icon: Wallet },
  { value: 'upi', label: 'UPI', description: 'UPI app', Icon: Smartphone }
];

export default function BookingCheckout() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostMessage, setHostMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests')) || 1;
  const nights = checkIn && checkOut
    ? Math.round((new Date(`${checkOut}T00:00:00.000Z`) - new Date(`${checkIn}T00:00:00.000Z`)) / 86400000)
    : 0;
  const subtotal = (listing?.pricePerNight || 0) * nights;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + cleaningFee + serviceFee;

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(({ data }) => setListing(data.listing))
      .catch((err) => setError(err.response?.data?.message || 'Could not load this stay'))
      .finally(() => setLoading(false));
  }, [id]);

  const continueToPayment = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      setError('Please confirm you understand this is a demo booking.');
      return;
    }
    if (!listing || nights < 1 || guests > listing.maxGuests) {
      setError('Check your dates and guest count, then try again.');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const { data } = await api.post('/bookings', {
        listingId: id,
        checkIn,
        checkOut,
        guests,
        hostMessage,
        paymentMethod
      });
      navigate('/trips', { state: { message: data.message } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not confirm this demo booking.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <main className="checkout-page"><div className="skeleton-card" /></main>;
  if (error && !listing) return <main className="checkout-page"><div className="error-state">{error}</div></main>;
  if (!listing) return null;

  if (!checkIn || !checkOut || nights < 1) {
    return <main className="checkout-page"><div className="empty-state"><h1>Choose your dates first</h1><p>Select valid dates on the stay page to continue to checkout.</p><Link className="primary-button" to={`/listings/${id}`}>Back to stay</Link></div></main>;
  }

  return (
    <main className="checkout-page">
      <Link className="checkout-back" to={`/listings/${id}`}><ArrowLeft size={18} /> Back to stay</Link>
      <h1>Review your booking</h1>
      <div className="checkout-layout">
        <form className="checkout-main" onSubmit={continueToPayment}>
          <section className="checkout-host-card">
            <h2>Write a message to the host</h2>
            <p>Let {listing.host?.name || 'your host'} know a little about your trip.</p>
            <div className="checkout-host">
              <img src={listing.host?.avatar || 'https://i.pravatar.cc/100?img=47'} alt="" />
              <div><strong>{listing.host?.name || 'Your host'}</strong><span>Hosting a welcoming stay in {listing.city}</span></div>
            </div>
            <label className="sr-only" htmlFor="host-message">Message to host</label>
            <textarea
              id="host-message"
              maxLength={1000}
              placeholder="Share what brings you to the area or ask the host a question."
              value={hostMessage}
              onChange={(event) => setHostMessage(event.target.value)}
            />
            <small>{hostMessage.length}/1,000 characters</small>
          </section>

          <section className="checkout-payment">
            <h2>Demo payment options</h2>
            <p>Choose an option to simulate checkout. No money will be charged.</p>
            <div className="checkout-payment-methods">
              {paymentOptions.map(({ value, label, description, Icon }) => (
                <label className={`checkout-payment-option${paymentMethod === value ? ' selected' : ''}`} key={value}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <Icon size={20} />
                  <span><strong>{label}</strong><small>{description}</small></span>
                </label>
              ))}
            </div>
            <p className="checkout-demo-note">Demo only — this does not connect to a bank, wallet, or payment provider.</p>
          </section>

          <section className="checkout-policy">
            <h2>Cancellation policy</h2>
            <p>This is a simulated booking. No real payment is taken, and cancellations do not issue refunds.</p>
          </section>

          <label className="checkout-terms">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
            <span>I understand this is a demo booking and no real payment will be made.</span>
          </label>
          {error && <div className="booking-message" role="alert">{error}</div>}
          <button className="checkout-pay-button" type="submit" disabled={processing || !acceptedTerms}>
            {processing ? 'Confirming demo booking…' : 'Confirm demo booking'}
          </button>
        </form>

        <aside className="checkout-summary">
          <div className="checkout-listing">
            <img src={listing.images?.[0]} alt={listing.title} />
            <div>
              <h2>{listing.title}</h2>
              <p>{listing.propertyType} · {listing.city}, {listing.country}</p>
              <span><Star size={14} fill="currentColor" /> {listing.rating?.toFixed(1)} ({listing.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="checkout-summary-section">
            <h3>Dates</h3>
            <p>{new Date(`${checkIn}T00:00:00`).toLocaleDateString()} – {new Date(`${checkOut}T00:00:00`).toLocaleDateString()}</p>
          </div>
          <div className="checkout-summary-section">
            <h3>Guests</h3>
            <p>{guests} guest{guests === 1 ? '' : 's'}</p>
          </div>
          <div className="checkout-summary-section">
            <h3>Price details</h3>
            <p><span>{nights} night{nights === 1 ? '' : 's'} × {formatINR(listing.pricePerNight)}</span><span>{formatINR(subtotal)}</span></p>
            <p><span>Cleaning fee</span><span>{formatINR(cleaningFee)}</span></p>
            <p><span>Service fee</span><span>{formatINR(serviceFee)}</span></p>
          </div>
          <div className="checkout-total"><strong>Total (INR)</strong><strong>{formatINR(total)}</strong></div>
        </aside>
      </div>
    </main>
  );
}
