import { formatCurrency } from '../utils/formatCurrency';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

const EMOJIS = { Food:'🍽️', Rent:'🏠', Transport:'🚗', Entertainment:'🎬', Health:'💊', Shopping:'🛍️', Utilities:'⚡', Others:'📦' };

function getBarColor(pct) {
  if (pct >= 100) return 'var(--danger)';
  if (pct >= 80) return 'var(--danger)';
  if (pct >= 50) return 'var(--warning)';
  return 'var(--success)';
}

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { category, limit, spent } = budget;
  const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  const barColor = getBarColor(pct);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="card budget-card">
      <div className="budget-card-header">
        <div className="budget-card-title">
          <span style={{ fontSize: 22 }}>{EMOJIS[category] || '📦'}</span>
          <span>{category}</span>
          {pct >= 100 && <span className="badge-pill" style={{ background: 'rgba(220,38,38,0.15)', color: 'var(--danger)', fontSize: 10 }}>Exceeded</span>}
        </div>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setMenuOpen(o => !o)}><MoreVertical size={16} /></button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, minWidth: 120, zIndex: 10, boxShadow: 'var(--shadow)' }}>
              <button className="nav-link" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => { onEdit(budget); setMenuOpen(false); }}>Edit</button>
              <button className="nav-link" style={{ padding: '8px 14px', fontSize: 13, color: 'var(--danger)' }} onClick={() => { onDelete(budget.id); setMenuOpen(false); }}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>
        {formatCurrency(spent)} <span style={{ color: 'var(--text-muted)' }}>of {formatCurrency(limit)}</span>
      </div>

      {spent === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No spend yet</div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div className="progress-bar-wrap" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: barColor, minWidth: 36 }}>{pct}%</span>
          </div>
        </div>
      )}
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{budget.txCount || 0} transactions this month</div>
    </div>
  );
}
