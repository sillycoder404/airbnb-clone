import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const empty = { title:'', description:'', location:'', city:'', country:'', pricePerNight:'', propertyType:'Apartment', bedrooms:1, beds:1, bathrooms:1, maxGuests:2, amenities:'Wi-Fi, Kitchen', images:'', cleaningFee:0 };

export default function ListingForm() {
  const { id } = useParams();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    api.get(`/listings/${id}`).then(({ data }) => {
      const listing = data.listing;
      setForm({ ...listing, amenities: listing.amenities.join(', '), images: listing.images.join(', ') });
    }).catch((err) => setError(err.response?.data?.message || 'Could not load listing'));
  }, [id]);
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.city || !form.country || !form.pricePerNight || !form.images) return setError('Please complete all required fields');
    setSaving(true);
    const payload = { ...form, pricePerNight:Number(form.pricePerNight), bedrooms:Number(form.bedrooms), beds:Number(form.beds), bathrooms:Number(form.bathrooms), maxGuests:Number(form.maxGuests), cleaningFee:Number(form.cleaningFee), amenities:form.amenities.split(',').map(v => v.trim()).filter(Boolean), images:form.images.split(',').map(v => v.trim()).filter(Boolean) };
    try {
      if (id) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host/listings');
    } catch (err) { setError(err.response?.data?.message || 'Could not save listing'); } finally { setSaving(false); }
  };
  return <main className="simple-page"><form className="listing-form" onSubmit={submit}><p className="eyebrow">Host an Airbnb Clone stay</p><h1>{id ? 'Edit listing' : 'Add a listing'}</h1>{error && <div className="form-error">{error}</div>}
    <div className="form-grid"><label>Title *<input value={form.title} onChange={e => setForm({...form,title:e.target.value})} /></label><label>Property type<select value={form.propertyType} onChange={e => setForm({...form,propertyType:e.target.value})}>{['House','Apartment','Villa','Cabin','Cottage','Room','Resort'].map(v => <option key={v}>{v}</option>)}</select></label><label className="full">Description *<textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></label><label>City *<input value={form.city} onChange={e => setForm({...form,city:e.target.value})} /></label><label>Country *<input value={form.country} onChange={e => setForm({...form,country:e.target.value})} /></label><label>Location<input value={form.location} onChange={e => setForm({...form,location:e.target.value})} /></label><label>Price per night *<input type="number" min="1" value={form.pricePerNight} onChange={e => setForm({...form,pricePerNight:e.target.value})} /></label><label>Bedrooms<input type="number" min="0" value={form.bedrooms} onChange={e => setForm({...form,bedrooms:e.target.value})} /></label><label>Beds<input type="number" min="1" value={form.beds} onChange={e => setForm({...form,beds:e.target.value})} /></label><label>Bathrooms<input type="number" min="1" value={form.bathrooms} onChange={e => setForm({...form,bathrooms:e.target.value})} /></label><label>Max guests<input type="number" min="1" value={form.maxGuests} onChange={e => setForm({...form,maxGuests:e.target.value})} /></label><label>Cleaning fee<input type="number" min="0" value={form.cleaningFee} onChange={e => setForm({...form,cleaningFee:e.target.value})} /></label><label>Amenities (comma separated)<input value={form.amenities} onChange={e => setForm({...form,amenities:e.target.value})} /></label><label className="full">Image URLs * (comma separated)<textarea value={form.images} onChange={e => setForm({...form,images:e.target.value})} /></label></div><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save listing'}</button></form></main>;
}
