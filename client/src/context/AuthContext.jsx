import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('staynest_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('staynest_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('staynest_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('staynest_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const updateAvatar = async (avatar) => {
    const { data } = await api.patch('/auth/avatar', { avatar });
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('staynest_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateAvatar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
