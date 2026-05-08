import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy-load heavy pages (charts, tables) — only loaded when navigated to
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Budget = lazy(() => import('./pages/Budget'));
const Settings = lazy(() => import('./pages/Settings'));

const BREADCRUMBS = { '/': 'Dashboard', '/transactions': 'Transactions', '/analytics': 'Analytics', '/budget': 'Budget', '/settings': 'Settings' };

function Toast() {
  const { toast } = useExpense();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}

// Lightweight loading fallback — no layout shift
function PageLoader() {
  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 12px' }} />
        <span style={{ fontSize: 14 }}>Loading...</span>
      </div>
    </div>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const breadcrumb = BREADCRUMBS[location.pathname] || 'ExpenseIQ';

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/login') return <Login />;

  return (
    <ProtectedRoute>
      <div className="app-layout">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-wrapper">
          <Topbar onToggle={() => setSidebarOpen(o => !o)} breadcrumb={breadcrumb} />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        <Toast />
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ExpenseProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </ExpenseProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
