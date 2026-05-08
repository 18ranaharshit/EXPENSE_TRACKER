import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings, Wallet, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Wallet size={18} /></div>
        <span className="sidebar-logo-text">ExpenseIQ</span>
        {collapsed && (
          <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          ) : (
            <div className="avatar">{user?.displayName?.charAt(0) || 'U'}</div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.displayName || 'User'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personal Account</div>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="nav-link" 
          style={{ 
            width: '100%', 
            border: 'none', 
            background: 'none', 
            color: 'var(--text-danger)',
            justifyContent: 'flex-start',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
