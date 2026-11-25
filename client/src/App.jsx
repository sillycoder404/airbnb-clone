import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Search from './pages/Search';
import ListingDetails from './pages/ListingDetails';
import BookingCheckout from './pages/BookingCheckout';
import { AuthPage } from './pages/Auth';
import Trips from './pages/Trips';
import Wishlist from './pages/Wishlist';
import HostDashboard from './pages/HostDashboard';
import HostBookings from './pages/HostBookings';
import HostListings from './pages/HostListings';
import ListingForm from './pages/ListingForm';
import { useAuth } from './context/AuthContext';

function Profile() {
  const { user } = useAuth();
  return (
    <main className="simple-page">
      <p className="eyebrow">Account</p><h1>Profile</h1>
      <div className="profile-card">
        <img src={user?.avatar || 'https://i.pravatar.cc/120'} alt="" />
        <h2>{user?.name}</h2><p>{user?.email}</p><span>{user?.role}</span>
      </div>
    </main>
  );
}

function InfoPage({ type }) {
  const content = type === 'about'
    ? { title: 'About Airbnb Clone', intro: 'A modern marketplace for memorable stays.', text: 'Airbnb Clone connects travelers with thoughtfully chosen homes and unique escapes through a React, Express, MongoDB, authentication, booking, and host-management experience.' }
    : { title: 'Help center', intro: 'Answers for a smoother stay.', text: 'Open a listing to view details and book. Manage reservations in My Trips and properties in the host dashboard. If the backend is unavailable, verify the environment configuration and server connection.' };
  return (
    <main className="simple-page info-page">
      <p className="eyebrow">Airbnb Clone</p><h1>{content.title}</h1><h2>{content.intro}</h2><p>{content.text}</p>
      {type === 'help' && <div className="faq">
        <details open><summary>How do I book a stay?</summary><p>Open a listing, choose valid dates and guests, then select Reserve.</p></details>
        <details><summary>How do bookings prevent conflicts?</summary><p>The server blocks reservations that overlap a confirmed booking.</p></details>
        <details><summary>Can I save listings?</summary><p>Log in and use the heart button, then open Wishlist from the profile menu.</p></details>
      </div>}
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/checkout/:id" element={<ProtectedRoute><BookingCheckout /></ProtectedRoute>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/about" element={<InfoPage type="about" />} />
        <Route path="/help" element={<InfoPage type="help" />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/host" element={<ProtectedRoute roles={['HOST','ADMIN']}><HostDashboard /></ProtectedRoute>} />
        <Route path="/host/bookings" element={<ProtectedRoute roles={['HOST','ADMIN']}><HostBookings /></ProtectedRoute>} />
        <Route path="/host/listings" element={<ProtectedRoute roles={['HOST','ADMIN']}><HostListings /></ProtectedRoute>} />
        <Route path="/host/listings/new" element={<ProtectedRoute roles={['HOST','ADMIN']}><ListingForm /></ProtectedRoute>} />
        <Route path="/host/listings/:id/edit" element={<ProtectedRoute roles={['HOST','ADMIN']}><ListingForm /></ProtectedRoute>} />
        <Route path="*" element={<main className="page-state"><div className="empty-state"><h1>Page not found</h1><p>The page you requested does not exist.</p></div></main>} />
      </Routes>
      <Footer />
    </>
  );
}
