import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Smartphone, Star } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error('Secure checkout could not be loaded. Please try again.'));
    };
    document.body.appendChild(script);
  });
}

function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function BookingCheckout() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostMessage, setHostMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
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
      setError('Please agree to the booking and cancellation terms before continuing.');
      return;
    }
    if (!listing || nights < 1 || guests > listing.maxGuests) {
      setError('Check your dates and guest count, then try again.');
      return;
    }

    setProcessing(true);
    setError('');
    let orderData;
    try {
      const { data } = await api.post('/payments/orders', {
        listingId: id,
        checkIn,
        checkOut,
        guests,
        hostMessage
      });
      orderData = data;
      await loadRazorpayCheckout();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not start secure checkout.');
      setProcessing(false);
      return;
    }

    try {
      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Airbnb Clone',
        description: listing.title,
        order_id: orderData.order.id,
        prefill: { name: user?.name, email: user?.email },
        config: {
          display: {
            blocks: {
              preferred: {
                name: 'Pay with UPI or card',
                instruments: [{ method: 'upi' }, { method: 'card' }]
              }
            },
            sequence: ['block.preferred'],
            preferences: { show_default_blocks: false }
          }
        },
        handler: async (paymentResponse) => {
          setProcessing(true);
          setError('');
          try {
            const { data } = await api.post('/payments/verify', {
              bookingId: orderData.bookingId,
              ...paymentResponse
            });
            navigate('/trips', { state: { message: data.message } });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed. Please contact support before trying again.');
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        theme: { color: '#176b4d' }
      });
      checkout.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. You can try again.');
        setProcessing(false);
      });
      checkout.open();
      setProcessing(false);
    } catch (err) {
      setError(err.message || 'Secure checkout could not be opened.');
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
      <h1>Review and pay</h1>
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
            <h2>Payment options</h2>
            <p>Your booking is confirmed after payment succeeds.</p>
            <div className="checkout-payment-methods">
              <div><Smartphone size={20} /><span>UPI</span></div>
              <div><CreditCard size={20} /><span>Credit or debit card</span></div>
            </div>
            <p className="checkout-secure"><ShieldCheck size={17} /> Payments are securely processed by Razorpay. Card details are never stored on this site.</p>
          </section>

          <section className="checkout-policy">
            <h2>Cancellation policy</h2>
            <p>Refunds are based on the total paid: cancel 48 hours or more before check-in for 75% back; cancel at least 24 but less than 48 hours before for 50% back; cancellations less than 24 hours before check-in are non-refundable.</p>
          </section>

          <label className="checkout-terms">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
            <span>I agree to the booking terms and cancellation policy.</span>
          </label>
          {error && <div className="booking-message" role="alert">{error}</div>}
          <button className="checkout-pay-button" type="submit" disabled={processing || !acceptedTerms}>
            {processing ? 'Preparing secure checkout…' : 'Continue to payment'}
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
