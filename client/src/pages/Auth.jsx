import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (isRegister && form.password.length < 6) return setError('Password must be at least 6 characters');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Invalid email');
    setLoading(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" to="/"><span className="brand-mark">A</span><span>Airbnb <span>Clone</span></span></Link>
        <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        {error && <div className="form-error">{error}</div>}
        {isRegister && <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        {isRegister && <label>I am joining as<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="USER">Traveler</option><option value="HOST">Host</option></select></label>}
        <button className="primary-button" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}</button>
        <p>{isRegister ? 'Already have an account?' : 'New to Airbnb Clone?' } <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create account'}</Link></p>
      </form>
    </main>
  );
}
