import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';

const BREADCRUMBS = { '/': 'Dashboard', '/transactions': 'Transactions', '/analytics': 'Analytics', '/budget': 'Budget', '/settings': 'Settings' };

function Toast() {
  const { toast } = useExpense();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const breadcrumb = BREADCRUMBS[location.pathname] || 'ExpenseIQ';

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onClose={() => setCollapsed(false)} />
      <div className={`main-wrapper${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Topbar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} breadcrumb={breadcrumb} />
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ExpenseProvider>
    </ThemeProvider>
  );
}
