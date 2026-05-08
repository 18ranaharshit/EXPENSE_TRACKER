import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
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
