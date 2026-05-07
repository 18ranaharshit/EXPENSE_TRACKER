import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings, Wallet, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onClose }) {
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

      <div className="sidebar-profile">
        <div className="avatar">AK</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Arjun Kumar</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personal Account</div>
        </div>
      </div>
    </aside>
  );
}
