import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link className="brand footer-brand" to="/"><span className="brand-mark">A</span><span>Airbnb <span>Clone</span></span></Link>
        <p>Thoughtful stays, remarkable places, memorable journeys.</p>
      </div>
      <div><strong>Explore</strong><Link to="/search">Search stays</Link><Link to="/search?destination=Goa">Goa</Link><Link to="/search?destination=Manali">Manali</Link></div>
      <div><strong>Support</strong><Link to="/help">Help center</Link><Link to="/about">About Airbnb Clone</Link><Link to="/host">Become a host</Link></div>
      <small>© 2026 Airbnb Clone. Built for demonstration and learning.</small>
    </footer>
  );
}
