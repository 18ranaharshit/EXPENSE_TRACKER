import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const checkUser = async (token) => {
    const activeToken = token || localStorage.getItem('auth_token');
    if (!activeToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('auth_token', activeToken);
      } else {
        setUser(null);
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  useEffect(() => {
    // On mount, check for existing token in localStorage
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
