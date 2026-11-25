import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import api from '../services/api';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    destination: params.get('destination') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    propertyType: params.get('propertyType') || '',
    bedrooms: params.get('bedrooms') || '',
    beds: params.get('beds') || '',
    guests: params.get('guests') || '',
    rating: params.get('rating') || '',
    sort: params.get('sort') || ''
  });

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/listings/search', { params: Object.fromEntries(params) })
      .then(({ data }) => setListings(data.listings))
      .catch((err) => setError(err.response?.data?.message || 'Could not load search results'))
      .finally(() => setLoading(false));
  }, [params]);

  const apply = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && next.set(key, value));
    setParams(next);
  };

  const clear = () => {
    setFilters({ destination: '', minPrice: '', maxPrice: '', propertyType: '', bedrooms: '', beds: '', guests: '', rating: '', sort: '' });
    setParams({});
  };

  return (
    <main className="search-page">
      <aside className="filters">
        <h2>Filters</h2>
        <form onSubmit={apply}>
          <label>Destination<input value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} /></label>
          <label>Minimum price<input type="number" min="0" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} /></label>
          <label>Maximum price<input type="number" min="0" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} /></label>
          <label>Property type<select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}><option value="">Any</option>{['House','Apartment','Villa','Cabin','Cottage','Room','Resort'].map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Bedrooms<select value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}><option value="">Any</option>{[1,2,3,4].map(v => <option key={v} value={v}>{v}+ bedrooms</option>)}</select></label>
          <label>Beds<select value={filters.beds} onChange={(e) => setFilters({ ...filters, beds: e.target.value })}><option value="">Any</option>{[1,2,3,4,5,6].map(v => <option key={v} value={v}>{v}+ bed{v > 1 ? 's' : ''}</option>)}</select></label>
          <label>Guests<input type="number" min="1" value={filters.guests} onChange={(e) => setFilters({ ...filters, guests: e.target.value })} /></label>
          <label>Minimum rating<select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}><option value="">Any</option>{[3,4,4.5].map(v => <option key={v} value={v}>{v}+ stars</option>)}</select></label>
          <button className="primary-button" type="submit">Apply filters</button>
          <button className="text-button" type="button" onClick={clear}>Clear filters</button>
        </form>
      </aside>
      <section className="search-results">
        <div className="results-toolbar"><h1>{loading ? 'Finding stays...' : `${listings.length} stays found`}</h1><select aria-label="Sort stays" value={filters.sort} onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); const next = new URLSearchParams(params); e.target.value ? next.set('sort', e.target.value) : next.delete('sort'); setParams(next); }}><option value="">Recommended</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option><option value="rating">Highest rated</option></select></div>
        {loading ? <div className="listing-grid">{[1,2,3,4,5,6].map(n => <div className="skeleton-card" key={n} />)}</div>
          : error ? <div className="error-state">{error}</div>
          : listings.length ? <div className="listing-grid">{listings.map(listing => <ListingCard key={listing._id} listing={listing} />)}</div>
          : <div className="empty-state"><h2>No stays found</h2><p>Try adjusting your destination or filters.</p><button className="primary-button" onClick={clear}>Clear filters</button></div>}
      </section>
    </main>
  );
}
