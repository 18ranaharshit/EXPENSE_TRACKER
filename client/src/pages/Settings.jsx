import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useExpense } from '../context/ExpenseContext';
import { Download, Upload, Trash2, Sun, Moon, Monitor } from 'lucide-react';

const MENU = ['Profile', 'Preferences', 'Categories', 'Notifications', 'Data Management', 'About'];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { transactions } = useExpense();
  const [active, setActive] = useState('Preferences');
  const [prefs, setPrefs] = useState({ currency: 'INR', language: 'en-IN', firstDay: 'Monday', compactMode: false, showCents: true, numberFormat: 'indian' });

  const setPref = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'expenseiq-data.json'; a.click();
  };
  const exportCSV = () => {
    const rows = [['Date','Title','Category','Type','Amount','Account','Notes'], ...transactions.map(t => [t.date, t.title, t.category, t.type, t.amount, t.account, t.notes])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'expenseiq-data.csv'; a.click();
  };

  return (
    <div className="page-content">
      <div className="settings-layout">
        {/* Left menu */}
        <div className="card card-body" style={{ alignSelf: 'start' }}>
          <div className="settings-menu">
            {MENU.map(item => (
              <button key={item} className={`settings-menu-item${active === item ? ' active' : ''}`} onClick={() => setActive(item)}>{item}</button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Preferences */}
          <div className="card card-body">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Preferences</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Customize your experience</p>

            {/* Theme */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Theme</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Choose appearance</span>
              </div>
              <div className="segmented">
                {[['light','Light',Sun],['dark','Dark',Moon],['system','System',Monitor]].map(([val, label, Icon]) => (
                  <button key={val} className={theme === val ? 'active' : ''} onClick={() => setTheme(val)} style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <Icon size={13} />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Currency</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Display currency symbol</span>
              </div>
              <select className="form-input" style={{ width: 'auto' }} value={prefs.currency} onChange={e => setPref('currency', e.target.value)}>
                <option value="INR">₹ Indian Rupee</option>
                <option value="USD">$ US Dollar</option>
                <option value="EUR">€ Euro</option>
              </select>
            </div>

            {/* Language */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Language</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>App language</span>
              </div>
              <select className="form-input" style={{ width: 'auto' }}>
                <option>English (India)</option>
                <option>English (US)</option>
              </select>
            </div>

            {/* First Day */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>First Day of Week</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>For calendar views</span>
              </div>
              <select className="form-input" style={{ width: 'auto' }} value={prefs.firstDay} onChange={e => setPref('firstDay', e.target.value)}>
                <option>Monday</option><option>Sunday</option>
              </select>
            </div>

            {/* Compact mode */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Compact Mode</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reduce spacing for more content</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={prefs.compactMode} onChange={e => setPref('compactMode', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Show cents */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Show Cents</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Display decimal places in amounts</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={prefs.showCents} onChange={e => setPref('showCents', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Number format */}
            <div className="settings-row">
              <div className="settings-row-left">
                <span style={{ fontWeight: 500 }}>Number Format</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Amount display style</span>
              </div>
              <div className="segmented">
                <button className={prefs.numberFormat === 'indian' ? 'active' : ''} onClick={() => setPref('numberFormat', 'indian')}>1,00,000</button>
                <button className={prefs.numberFormat === 'intl' ? 'active' : ''} onClick={() => setPref('numberFormat', 'intl')}>100,000</button>
              </div>
            </div>
          </div>

          {/* Profile preview */}
          <div className="card card-body">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Display Name</label><input className="form-input" defaultValue="Arjun Kumar" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="arjun@example.com" type="email" /></div>
            </div>
            <button className="link" style={{ marginTop: 12 }}>Change Password</button>
          </div>

          {/* Data management */}
          <div className="card card-body">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Data Management</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={exportJSON}><Download size={14} /> Export JSON</button>
              <button className="btn btn-outline btn-sm" onClick={exportCSV}><Download size={14} /> Export CSV</button>
              <button className="btn btn-outline btn-sm"><Upload size={14} /> Import Data</button>
              <button className="btn btn-danger-outline btn-sm" style={{ marginLeft: 'auto' }}><Trash2 size={14} /> Delete All Data</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 10 }}>⚠ Delete All Data is irreversible and cannot be undone.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
