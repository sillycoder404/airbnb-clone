import { useRef, useState } from 'react';
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
import AdminDashboard from './pages/AdminDashboard';
import ListingForm from './pages/ListingForm';
import { useAuth } from './context/AuthContext';

function prepareProfilePhoto(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      const scale = Math.min(1, 384 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('Could not prepare this image'));
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Could not prepare this image'));
        if (blob.size > 256 * 1024) return reject(new Error('Choose a smaller image and try again'));
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read this image'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.8);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('This image format could not be opened'));
    };
    image.src = imageUrl;
  });
}

function Profile() {
  const { user, updateAvatar } = useAuth();
  const photoInput = useRef(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');

  const changePhoto = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setPhotoError('');
    setPhotoMessage('');
    if (!file.type.startsWith('image/')) {
      setPhotoError('Choose an image file');
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Choose an image smaller than 10 MB');
      input.value = '';
      return;
    }

    setSavingPhoto(true);
    try {
      const avatar = await prepareProfilePhoto(file);
      await updateAvatar(avatar);
      setPhotoMessage('Profile photo updated');
    } catch (error) {
      setPhotoError(error.response?.data?.message || error.message || 'Could not update your photo');
    } finally {
      setSavingPhoto(false);
      input.value = '';
    }
  };

  return (
    <main className="simple-page">
      <p className="eyebrow">Account</p><h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-photo-section">
          <img className="profile-photo" src={user?.avatar || 'https://i.pravatar.cc/120'} alt={`${user?.name || 'Account'} profile`} />
          <div className="profile-photo-actions">
            <button className="primary-button" type="button" onClick={() => photoInput.current?.click()} disabled={savingPhoto}>
              {savingPhoto ? 'Saving photo…' : 'Change profile photo'}
            </button>
            <input ref={photoInput} type="file" accept="image/*" onChange={changePhoto} hidden />
            <small>Choose an image from your device. It will be resized before saving.</small>
          </div>
        </div>
        {photoError && <div className="form-error" role="alert">{photoError}</div>}
        {photoMessage && <div className="booking-message" role="status">{photoMessage}</div>}
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
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/host" element={<ProtectedRoute roles={['HOST']}><HostDashboard /></ProtectedRoute>} />
        <Route path="/host/bookings" element={<ProtectedRoute roles={['HOST']}><HostBookings /></ProtectedRoute>} />
        <Route path="/host/listings" element={<ProtectedRoute roles={['HOST']}><HostListings /></ProtectedRoute>} />
        <Route path="/host/listings/new" element={<ProtectedRoute roles={['HOST']}><ListingForm /></ProtectedRoute>} />
        <Route path="/host/listings/:id/edit" element={<ProtectedRoute roles={['HOST']}><ListingForm /></ProtectedRoute>} />
        <Route path="*" element={<main className="page-state"><div className="empty-state"><h1>Page not found</h1><p>The page you requested does not exist.</p></div></main>} />
      </Routes>
      <Footer />
    </>
  );
}
