import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const { user, loading, checkUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [tokenProcessed, setTokenProcessed] = useState(false);

  // Capture token from URL after Google OAuth redirect
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      checkUser(token).then(() => setTokenProcessed(true));
    } else {
      setTokenProcessed(true);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // While processing token or checking auth, show loading
  if (loading || !tokenProcessed) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#7B61FF', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 16px' }} />
          <span>Signing you in...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      <div className="login-card" style={{
        padding: '3rem',
        borderRadius: '1.5rem',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(123, 97, 255, 0.2)',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#7B61FF' }}>ExpenseIQ</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Master your spending with style</p>
        
        <button 
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'white',
            color: '#1e293b',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="24" height="24" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
