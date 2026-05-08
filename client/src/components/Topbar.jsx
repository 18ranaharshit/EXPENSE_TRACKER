import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Topbar({ onToggle, breadcrumb }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" onClick={onToggle} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <span className="breadcrumb">{breadcrumb}</span>
      </div>

      <div className="topbar-right">
        <div className="theme-toggle">
          <button className={theme === 'light' ? 'active' : ''} onClick={() => toggleTheme()} title="Light mode">
            <Sun size={15} />
          </button>
          <button className={theme === 'dark' ? 'active' : ''} onClick={() => toggleTheme()} title="Dark mode">
            <Moon size={15} />
          </button>
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="avatar" style={{ cursor: 'default' }}>AK</div>
      </div>
    </header>
  );
}
