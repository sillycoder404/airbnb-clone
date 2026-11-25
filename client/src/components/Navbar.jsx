import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Globe2, Heart, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const search = (event) => {
    event.preventDefault();
    navigate(`/search${destination ? `?destination=${encodeURIComponent(destination)}` : ''}`);
  };

  return (
    <header className="nav-shell">
      <nav className="navbar">
        <Link className="brand" to="/" aria-label="Airbnb Clone home">
          <span className="brand-mark">A</span>
          <span>Airbnb <span>Clone</span></span>
        </Link>

        <form className="nav-search" onSubmit={search}>
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Where would you like to go?"
            aria-label="Destination"
          />
          <button aria-label="Search"><Search size={18} /></button>
        </form>

        <div className={`nav-actions ${open ? 'open' : ''}`}>
          {user?.role === 'ADMIN'
            ? <Link to="/admin" onClick={() => setOpen(false)}>Admin portal</Link>
            : user?.role === 'HOST'
            ? <Link to="/host" onClick={() => setOpen(false)}>Host dashboard</Link>
            : <Link to={user ? '/host' : '/register'} onClick={() => setOpen(false)}>Become a host</Link>}
          <Link to="/help" className="icon-link" aria-label="Help"><Globe2 size={20} /></Link>
          {user ? (
            <>
              <Link to="/wishlist" className="icon-link" aria-label="Saved listings"><Heart size={20} /></Link>
              <details className="profile-menu">
                <summary aria-label="Profile menu"><UserRound size={20} /></summary>
                <div>
                  <strong>{user.name}</strong>
                  <Link to="/profile">Profile</Link>
                  <Link to="/trips">My trips</Link>
                  {user.role === 'HOST' && <>
                    <Link to="/host">Host dashboard</Link>
                    <Link to="/host/bookings">Reservations</Link>
                    <Link to="/host/listings">My listings</Link>
                  </>}
                  {user.role === 'ADMIN' && <Link to="/admin">Admin portal</Link>}
                  <button onClick={logout}>Log out</button>
                </div>
              </details>
            </>
          ) : (
            <Link className="login-button" to="/login">Log in</Link>
          )}
        </div>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
      </nav>
    </header>
  );
}
